/*
 *      Copyright (c) 2016 Samsung Electronics Co., Ltd
 *
 *      Licensed under the Flora License, Version 1.1 (the "License");
 *      you may not use this file except in compliance with the License.
 *      You may obtain a copy of the License at
 *
 *              http://floralicense.org/license/
 *
 *      Unless required by applicable law or agreed to in writing, software
 *      distributed under the License is distributed on an "AS IS" BASIS,
 *      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *      See the License for the specific language governing permissions and
 *      limitations under the License.
 */

/*global listController, pageController*/

(function() {
    var PERSON_DATA_NAME = [
            // Dummy data for test use.
            // This array contains the name of buddy,
            // English name
            // (Alice, Arthur, etc.)
            // Unicode name
            // (철수, 영희, etc.)
            // blank name.
            // (The 9th element of array)
            "All", "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
            
        ],
        PERSON_DATA_NUM = [
            // Dummy data for test use.
            // This array contains the phone number of buddy,
            // Full number
            // (From 1st element to 11th element)
            // No data
            // (After 12th element)
            "010-1234-5678",
            "010-2345-6789",
            "010-3456-7890",
            "010-4567-8901",
            "010-5678-9012",
            "010-6789-0123",
            "010-7890-1234",
            "010-8901-2345",
            "010-9012-3456",
            "010-0123-4567",
            "",
            "",
            "",
            ""
        ],
        PERSON_DATA_IMAGE = [
            // Dummy data for test use.
            // This array contains the image data of buddy,
            // Address of the photo image
            // (1st element)
            // No data
            // (After 2nd element)
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ],
        HEADER_DATA = {
            // Dummy data for test use.
            // This array contains the style data of header animation.
            // The header may have three status,
            // None
            // (Should not be seen)
            // Half
            // (Should be seen at the top of header area)
            // Full
            // (Should be seen at the center of header area)
            "NONE": {
                "top": "-41px"
            },
            "HALF": {
                "top": "11px"
            },
            "FULL": {
                "top": "51px"
            }
        },

        ANIM_DURATION = 400,

        animRequest = 0,
        animStartTime = 0;

    /**
     * Removes all child of the element.
     * @private
     * @param {Object} elm - The object wants to be emptied
     * @return {Object} The emptied element
     */
    function emptyElement(elm) {
        while (elm.firstChild) {
            elm.removeChild(elm.firstChild);
        }

        return elm;
    }

    /**
     * Creates and returns the callback function that processes jobs should be done before the page become changed.
     * The contents of contact page will be changed by this function, then the page will be changed to the contact page.
     * @private
     * @param {number} data - The index of the element in the buddy list
     * @return {function} The callback function for changing page to the contact
     */
    function createPageChangeFunc(data) {
        return function() {
            var elmName = document.querySelector("#name-contact"),
                elmNum = document.querySelector("#number-contact");

            // Reset the name and number in the contact page.
            emptyElement(elmName).appendChild(document.createTextNode(PERSON_DATA_NAME[data]));
            emptyElement(elmNum).appendChild(document.createTextNode(PERSON_DATA_NUM[data]));

            // Reset the background of the contact page
            pageController.setPageBgImage("page-contact", PERSON_DATA_IMAGE[data]);
            // Change the page to the contact page
            pageController.movePage("page-contact");
        };
    }

    /**
     * Pushes person data to the buddy list.
     * @private
     */
    function pushData() {
        var i;
        for (i = 0; i < PERSON_DATA_NAME.length; i++) {
            // If the data of image address exists, add data with the image address.
            // Otherwise, add data without the image address.
            if (PERSON_DATA_IMAGE[i]) {
                listController.addData(PERSON_DATA_NAME[i], PERSON_DATA_IMAGE[i], createPageChangeFunc(i));
            } else {
                listController.addData(PERSON_DATA_NAME[i], null, createPageChangeFunc(i));
            }
        }
    }

    /**
     * Handles the hardware key events.
     * @private
     * @param {Object} ev - The object contains data of key event.
     */
    function keyEventHandler(ev) {
        if (ev.keyName === "back") {
            if (pageController.isPageMain() === true) {
                // Terminate the application if the current page is the main page.
                try {
                    tizen.application.getCurrentApplication().exit();
                } catch (ignore) {}
            } else {
                // Go to the last page if the current page is not the main page.
                pageController.moveBackPage();
            }
        }
    }

    /**
     * Sets the style of elements in container by origPos, destPos, ratio.
     * @private
     * @param {Object} elm - An object of the container element.
     * @param {string} origPos- Original position of transition.
     * @param {string} destPos- Destination position of transition.
     * @param {number} ratio - Progress ratio of transition.
     */
    function setAnimationStyle(elm, origPos, destPos, ratio) {
        var valOrigStyle,
            valDestStyle,
            valAnimStyle;

        if (ratio > 1) {
            ratio = 1;
        }

        // Calculate the style value of the header should be.
        Object.keys(HEADER_DATA[origPos]).forEach(function(key) {
            switch (key) {
                case "top":
                    valOrigStyle = parseFloat(HEADER_DATA[origPos][key]);
                    valDestStyle = parseFloat(HEADER_DATA[destPos][key]);
                    valAnimStyle = (valOrigStyle + (valDestStyle - valOrigStyle) * ratio) + "px";
                    break;
                default:
                    break;
            }

            elm.style[key] = valAnimStyle;
        });
    }

    /**
     * Makes a snapshot of animation frame by setting style to containers by progress ratio, calculated by timestamp.
     * @private
     * @param {string} animStart - Starting position of the animation.
     * @param {string} animEnd- Ending position of the animation.
     * @param {number} timestamp - DOMHighResTimeStamp value passed by requestAnimationFrame.
     */
    function drawAnimationFrame(animStart, animEnd, timestamp) {
        var elmHeader = document.querySelector(".header"),
            progress;

        // If there is no working animation, animation flag will be set to with the timestamp.
        if (!animStartTime) {
            animStartTime = timestamp;
        }
        progress = timestamp - animStartTime;

        setAnimationStyle(elmHeader, animStart, animEnd, progress / ANIM_DURATION);

        // If the animation is not reached to the end of time, Request the next frame of rendering for animation.
        // Otherwise, clear the request and flag.
        if (progress < ANIM_DURATION) {
            animRequest = window.requestAnimationFrame(drawAnimationFrame.bind(this, animStart, animEnd));
        } else {
            animRequest = 0;
            animStartTime = 0;
        }
    }

    /**
     * Starts the animation by setting the first requestAnimationFrame API call.
     * @private
     * @param {string} start - Starting position of the animation.
     * @param {string} end- Ending position of the animation.
     */
    function setHeaderAnimation(start, end) {
        if (animRequest) {
            window.cancelAnimationFrame(animRequest);
        }
        animRequest = window.requestAnimationFrame(drawAnimationFrame.bind(this, start, end));
    }

    /**
     * Activates the header animation when scroll down event was fired.
     * @private
     * @param {number} focusPos - The position of focus in list.
     * @param {number} diff - The difference of focus by scrolling.
     */
    function scrollDownCallbackHeader(focusPos, diff) {
        // The header will be disappeared
        switch (focusPos) {
            case 0:
                if (diff === 1) {
                    // Full header -> Half header
                    setHeaderAnimation("FULL", "HALF");
                } else {
                    // Full header -> No header
                    setHeaderAnimation("FULL", "NONE");
                }
                break;
            case 1:
                // Half header -> No header
                setHeaderAnimation("HALF", "NONE");
                break;
            default:
                break;
        }
    }

    /**
     * Activates the header animation when scroll up event was fired.
     * @private
     * @param {number} focusPos - The position of focus in list.
     * @param {number} diff - The difference of focus by scrolling.
     */
    function scrollUpCallbackHeader(focusPos, diff) {
        if (pageController.isPageMain() === true) {
            // The header will be appeared
            switch (focusPos) {
                case 1:
                    // Half header -> Full header
                    setHeaderAnimation("HALF", "FULL");
                    break;
                default:
                    if (focusPos + diff === 1) {
                        // No header -> Half header
                        setHeaderAnimation("NONE", "HALF");
                    } else if (focusPos + diff === 0) {
                        // No header -> Full header
                        setHeaderAnimation("NONE", "FULL");
                    }
                    break;
            }
        }
    }

    /**
     * Initiates the application.
     * @private
     */
    function init() {
        listController.init("list-buddy");
        // Push all data to the list
        pushData();
        // Add hardware key event listener
        window.addEventListener("tizenhwkey", keyEventHandler);
        // Add both pages to the page controller
        pageController.addPage("page-main");
        pageController.addPage("page-settings");

        pageController.addPage("page-contact");
        // Set callback functions for scroll up and down
        // Those functions will animate the header if needed.
        listController.setScrollUpCallback(scrollUpCallbackHeader);
        listController.setScrollDownCallback(scrollDownCallbackHeader);
    }

    window.onload = init();
}());