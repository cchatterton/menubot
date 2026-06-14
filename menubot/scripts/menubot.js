(function($) {
    'use strict';

    $(function() {
        var selectedIndex = -1;
        var $floatingButton = $('<button>', {
            id: 'menubot-floating-btn',
            type: 'button',
            'aria-label': 'Open Menubot'
        }).append($('<span>', {
            class: 'dashicons dashicons-menu',
            'aria-hidden': 'true'
        }));
        var $inputContainer = $('<div>', {
            id: 'menubot-input-container'
        });
        var $input = $('<input>', {
            type: 'text',
            id: 'menubot-input',
            autocomplete: 'off',
            'aria-label': 'Search admin menu'
        });
        var $suggestions = $('<div>', {
            id: 'menubot-suggestions',
            role: 'listbox'
        });

        $inputContainer.append($input, $suggestions);
        $('body').append($floatingButton, $inputContainer);

        $floatingButton.on('click', function() {
            toggleInput();
        });

        $input.on('input', function() {
            selectedIndex = -1;
            renderSuggestions(buildSuggestions($(this).val().trim().toLowerCase()));
        });

        $input.on('keydown', function(event) {
            var $suggestionItems = $('#menubot-suggestions a');

            if ('ArrowDown' === event.key && $suggestionItems.length) {
                selectedIndex = (selectedIndex + 1) % $suggestionItems.length;
                updateSelection();
                event.preventDefault();
            } else if ('ArrowUp' === event.key && $suggestionItems.length) {
                selectedIndex = (selectedIndex - 1 + $suggestionItems.length) % $suggestionItems.length;
                updateSelection();
                event.preventDefault();
            } else if ('Enter' === event.key) {
                followSelectedItem(event, $suggestionItems);
            }
        });

        $(document).on('mouseover', '#menubot-suggestions a', function() {
            selectedIndex = $('#menubot-suggestions a').index(this);
            updateSelection();
        });

        $(document).on('keydown', function(event) {
            if ((event.metaKey || event.ctrlKey) && 'e' === event.key) {
                event.preventDefault();
                toggleInput();
            }
        });

        function toggleInput() {
            $inputContainer.toggle();
            $input.trigger('focus');
            $suggestions.empty();
            selectedIndex = -1;
        }

        function buildSuggestions(query) {
            var suggestions = [];
            var seenItems = new Set();

            if ('*' === query) {
                $('#adminmenu li').each(function() {
                    var $link = $(this).children('a');
                    addSuggestion(suggestions, seenItems, $link.text(), $link.attr('href'), 'parent-menu');
                });

                return sortAlphabetically(suggestions);
            }

            if (!query) {
                return suggestions;
            }

            $('#adminmenu li').each(function() {
                var $item = $(this);
                var $link = $item.children('a');
                var menuItemText = $link.text();
                var menuItemLink = $link.attr('href');

                if ($item.hasClass('wp-has-submenu')) {
                    $item.find('ul li a').each(function() {
                        var $submenuLink = $(this);
                        var submenuText = $submenuLink.text();

                        if (submenuText.toLowerCase().includes(query)) {
                            addSuggestion(
                                suggestions,
                                seenItems,
                                menuItemText + ' > ' + submenuText,
                                $submenuLink.attr('href'),
                                'submenu-item'
                            );
                        }
                    });
                }

                if (menuItemText.toLowerCase().includes(query)) {
                    addSuggestion(suggestions, seenItems, menuItemText, menuItemLink, 'parent-menu');
                }
            });

            return suggestions.sort(function(a, b) {
                if ('parent-menu' === a.className && 'parent-menu' !== b.className) {
                    return -1;
                }

                if ('parent-menu' !== a.className && 'parent-menu' === b.className) {
                    return 1;
                }

                return a.text.localeCompare(b.text);
            });
        }

        function addSuggestion(suggestions, seenItems, text, href, className) {
            var cleanText = (text || '').trim();
            var cleanHref = (href || '').trim();

            if (!cleanText || !cleanHref || seenItems.has(cleanHref)) {
                return;
            }

            suggestions.push({
                text: cleanText,
                href: cleanHref,
                className: className
            });
            seenItems.add(cleanHref);
        }

        function sortAlphabetically(suggestions) {
            return suggestions.sort(function(a, b) {
                return a.text.localeCompare(b.text);
            });
        }

        function renderSuggestions(suggestions) {
            $suggestions.empty();

            suggestions.forEach(function(suggestion) {
                var $suggestionItem = $('<div>', {
                    class: 'menubot-suggestion-item'
                });
                var $suggestionLink = $('<a>', {
                    href: suggestion.href,
                    class: suggestion.className,
                    role: 'option'
                }).text(suggestion.text);

                $suggestionItem.append($suggestionLink);
                $suggestions.append($suggestionItem);
            });
        }

        function followSelectedItem(event, $suggestionItems) {
            var postId = $input.val().trim();
            var selectedSuggestion = $suggestionItems[selectedIndex];

            if (/^\d+$/.test(postId) && 0 === $suggestionItems.length) {
                openPostEditUrl(event, postId);
                return;
            }

            if ($suggestionItems.length) {
                if ((event.metaKey || event.ctrlKey) && selectedSuggestion) {
                    window.open(selectedSuggestion.href, '_blank', 'noopener');
                } else if (selectedIndex >= 0 && selectedIndex < $suggestionItems.length) {
                    selectedSuggestion.click();
                } else {
                    $suggestionItems[0].click();
                }

                event.preventDefault();
            }
        }

        function openPostEditUrl(event, postId) {
            var currentLang = new URLSearchParams(window.location.search).get('lang');
            var editUrl = new URL('/wp-admin/post.php', window.location.origin);

            editUrl.searchParams.set('post', postId);
            editUrl.searchParams.set('action', 'edit');

            if (currentLang) {
                editUrl.searchParams.set('lang', currentLang);
            }

            if (event.metaKey || event.ctrlKey) {
                window.open(editUrl.toString(), '_blank', 'noopener');
            } else {
                window.location.href = editUrl.toString();
            }

            event.preventDefault();
        }

        function updateSelection() {
            var $suggestionItems = $('#menubot-suggestions a');

            $suggestionItems.removeClass('selected').attr('aria-selected', 'false');

            if (selectedIndex >= 0 && selectedIndex < $suggestionItems.length) {
                $($suggestionItems[selectedIndex]).addClass('selected').attr('aria-selected', 'true');
            }
        }
    });
})(jQuery);
