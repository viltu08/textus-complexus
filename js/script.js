window.onload = function () {
    // =====================================================
    // [1] Check for GSAP Core Library and Register Plugins
    // =====================================================
    if (typeof gsap === 'undefined') {
        console.error("GSAP core library is NOT loaded! Check the script tag for gsap.min.js");
        return;
    }

    let pluginsToRegister = [];

    // Check and add DrawSVGPlugin
    if (typeof DrawSVGPlugin === 'undefined') {
        console.error("DrawSVGPlugin is NOT loaded! Check the script tag for DrawSVGPlugin.min.js");
    } else {
        pluginsToRegister.push(DrawSVGPlugin);
    }

    // Check and add ScrollToPlugin
    if (typeof ScrollToPlugin === 'undefined') {
        console.warn("ScrollToPlugin is NOT loaded or used in this script, but linked.");
    } else {
        pluginsToRegister.push(ScrollToPlugin);
    }

    // === Integrate check and add MotionPathPlugin here ===
    if (typeof MotionPathPlugin === 'undefined') {
        console.error("MotionPathPlugin is NOT loaded! Check the script tag for MotionPathPlugin.min.js. SVG22 animation requires this plugin.");
    } else {
        pluginsToRegister.push(MotionPathPlugin);
    }
    // =====================================================


    if (pluginsToRegister.length > 0) {
        try {
            // Register all found plugins
            gsap.registerPlugin(...pluginsToRegister);
        } catch (e) {
            console.error("Error registering available GSAP plugins:", e);
        }
    } else {
        console.warn("No GSAP plugins found or registered that are explicitly checked for.");
    }

    // =====================================================
    // [2] SVG4 - Soft Fabric Ripple Effect on Paths (Simplified)
    // =====================================================
    const svg4 = document.getElementById('svg4');
    if (svg4) {
        const paths = svg4.querySelectorAll('path');

        gsap.set(paths, {
            strokeDasharray: "0 1000",
            strokeDashoffset: 1000,
            transformOrigin: "center center",
            strokeWidth: 1.1,
            opacity: 0.6,
            stroke: "#ffefe4"
        });

        paths.forEach((path, i) => {
            const length = path.getTotalLength();
            const delay = i * 0.8;

            // Animation to draw the path
            gsap.to(path, {
                strokeDasharray: `${length} ${length}`,
                strokeDashoffset: 0,
                duration: 6,
                delay: delay,
                ease: "sine.inOut",
                repeat: -1,
            });

            // Initial opacity animation (can be part of the ripple)
            gsap.to(path, {
                opacity: 0.8,
                duration: 8,
                delay: delay,
                ease: "sine.out" // Note: Original used sine.out, ripple uses sine.inOut
            });

            const createRipple = () => {
                const duration = gsap.utils.random(10, 14);

                const tl = gsap.timeline({
                    onComplete: createRipple
                });

                // Simplified ripple effects (opacity and stroke width variations)
                // Removed motionPath which caused elements to go out of frame

                tl.to(path, {
                    opacity: gsap.utils.random(0.7, 0.9),
                    duration: duration * 0.8,
                    ease: "sine.inOut"
                }, 0); // The '0' makes this start at the same time as other tweens in this timeline

                tl.to(path, {
                    strokeWidth: gsap.utils.random(1.1, 1.25),
                    duration: duration * 1.2,
                    ease: "sine.inOut"
                }, 0); // The '0' makes this start at the same time as other tweens in this timeline
            };

            // Start the ripple effect after an initial delay
            gsap.delayedCall(delay + 5, createRipple);
        });
    }
    // =====================================================
    // [3] SVG5 - Gravity Ellipses with Bounce and Float
    // =====================================================
    const svg5 = document.getElementById('svg5');
    if (svg5) {
        const ellipses = svg5.querySelectorAll('ellipse');
        const originalPositions = [];

        ellipses.forEach(ellipse => {
            originalPositions.push({
                cx: ellipse.getAttribute('cx'),
                cy: ellipse.getAttribute('cy')
            });
        });

        const applyGravity = () => {
            gsap.set(ellipses, {
                attr: {
                    cy: -50
                },
                opacity: 0
            });

            ellipses.forEach(ellipse => {
                gsap.killTweensOf(ellipse);
            });

            ellipses.forEach((ellipse, index) => {
                const delay = index * 0.1 + Math.random() * 0.3;

                gsap.to(ellipse, {
                    attr: {
                        cy: originalPositions[index].cy
                    },
                    opacity: 1,
                    duration: 1.5 + Math.random() * 0.5,
                    delay: delay,
                    ease: "bounce.out",
                    onComplete: () => {
                        gsap.to(ellipse, {
                            attr: {
                                cy: originalPositions[index].cy + 5
                            },
                            duration: 0.2,
                            yoyo: true,
                            repeat: -1,
                            ease: "sine.inOut"
                        });
                    }
                });
            });

            const totalDuration = 0.1 * (ellipses.length - 1) + 1.5 + 0.5 + 3;
            gsap.delayedCall(totalDuration, applyGravity);
        };

        applyGravity();
    }

    // =====================================================
    // [4] SVG6 - Horizontal Floating Lines
    // =====================================================
    const svg6 = document.getElementById('svg6');
    if (svg6) {
        const lines = svg6.querySelectorAll('line');

        gsap.set(lines, {
            transformOrigin: "center center",
            opacity: 1
        });

        lines.forEach((line, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const duration = gsap.utils.random(1, 2);
            const distance = gsap.utils.random(2, 300);
            const delay = gsap.utils.random(0, 10);

            gsap.to(line, {
                x: direction * distance,
                duration: duration,
                delay: delay,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });

            gsap.to(line, {
                opacity: gsap.utils.random(0.7, 0.9),
                duration: gsap.utils.random(4, 7),
                delay: delay,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        });
    }

    // =====================================================
    // [5] DrawSVG Animation for Other SVG Elements
    // =====================================================
    // Note: SVG22 is explicitly excluded here as it uses MotionPath
    const elementsToDraw = gsap.utils.toArray(".overlay-svg-container [stroke]:not(#svg4 *, #svg5 *, #svg6 *, #svg22 *)");


    if (elementsToDraw.length === 0) {
        console.warn("No elements with strokes found to animate with DrawSVG after filtering.");
    }
    // Also check if DrawSVGPlugin is registered before trying to use it
    else if (typeof DrawSVGPlugin === 'undefined' || !gsap.plugins.drawSVG) {
        console.warn("DrawSVGPlugin is not registered or available. Please ensure the plugin is loaded and registered.");
    } else {
        gsap.from(elementsToDraw, {
            drawSVG: "0%",
            duration: 3,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }

    // =====================================================
    // [6] SVG17 - Specialized Camera Effect (Circular Motion)
    // =====================================================
    const svg20 = document.getElementById('svg17'); // Note: ID is svg17 in HTML, code uses svg20 variable name
    if (svg20) {
        const cameraGroup20 = svg20.querySelector('#cameraGroup');
        if (cameraGroup20) {
            gsap.set(cameraGroup20, {
                scale: 1,
                x: 0,
                y: 0,
                transformOrigin: "center center"
            });

            // Create a unique timeline for SVG20
            const tlSvg20 = gsap.timeline({
                repeat: -1
            });

            // Circular motion effect
            tlSvg20.to(cameraGroup20, {
                scale: 3,
                duration: 4,
                ease: "sine.inOut"
            });

            // Create a circular path motion
            tlSvg20.to(cameraGroup20, {
                rotation: 360,
                duration: 15,
                ease: "none",
                transformOrigin: "center center"
            }, "-=3");

            // Pulse zoom effect
            tlSvg20.to(cameraGroup20, {
                scale: 2,
                duration: 3,
                ease: "sine.inOut",
                yoyo: true,
                repeat: 1
            }, "-=12");

            // Return to starting position
            tlSvg20.to(cameraGroup20, {
                scale: 1,
                rotation: 0,
                x: 0,
                y: 0,
                duration: 5,
                ease: "power2.inOut"
            });
        } else {
            console.warn("No cameraGroup found in SVG17 (variable svg20).");
        }
    } else {
        console.warn("SVG element with ID 'svg17' (variable svg20) not found.");
    }

    // =====================================================
    // [7] SVG9, SVG10 & SVG12 - Original Camera Zoom and Pan Effect
    // =====================================================
    const cameraTargets = ['svg9', 'svg10', 'svg12'].map(id => {
        const svg = document.getElementById(id);
        return svg ? svg.querySelector('#cameraGroup') : null;
    }).filter(el => el);

    if (cameraTargets.length === 0) {
        console.warn("No valid cameraGroup elements found inside #svg9, #svg10 or #svg12.");
    } else {
        cameraTargets.forEach(group => {
            gsap.set(group, {
                scale: 1,
                x: 0,
                y: 0,
                transformOrigin: "center center"
            });

            const tl = gsap.timeline({
                repeat: -1,
                repeatDelay: 4
            });

            // Zoom in
            tl.to(group, {
                scale: 5,
                x: 0,
                y: 0,
                duration: 5,
                ease: "power2.inOut"
            });

            // Pan right
            tl.to(group, {
                x: -500,
                duration: 6,
                ease: "sine.inOut"
            });

            // Pan slightly left (to simulate looking back)
            tl.to(group, {
                x: -400,
                duration: 4,
                ease: "sine.inOut"
            });

            // Zoom out
            tl.to(group, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 6,
                ease: "power2.inOut"
            });
        });
    }

    // =====================================================
    // [8] SVG20 text type effect - Note: This section uses ID 'svg20', distinct from the variable 'svg20' used for SVG17
    // =====================================================

    const svgElementTyping = document.getElementById('svg20'); // Update this ID
    const svgNS = 'http://www.w3.org/2000/svg'; // SVG Namespace

    if (svgElementTyping) {
        const textElements = svgElementTyping.querySelectorAll('text');
        const animatedTextElements = []; // Will hold the new text elements with tspans

        textElements.forEach(textElement => {
            const originalText = textElement.textContent;
            const originalAttributes = textElement.attributes;

            const animatedTextElement = document.createElementNS(svgNS, 'text');

            for (let i = 0; i < originalAttributes.length; i++) {
                const attr = originalAttributes[i];
                if (attr.name !== 'id' && attr.name !== 'textContent' && attr.name !== 'class' && attr.name !== 'style') {
                    animatedTextElement.setAttribute(attr.name, attr.value);
                }
            }
            if (textElement.style.cssText) {
                animatedTextElement.style.cssText = textElement.style.cssText;
            }

            animatedTextElement.style.opacity = 1;
            animatedTextElement.classList.add('typing-animated-container');

            const tspansForAnimation = [];

            textElement.style.opacity = 0;
            textElement.style.visibility = 'hidden';

            textElement.parentNode.insertBefore(animatedTextElement, textElement.nextSibling);

            for (let i = 0; i < originalText.length; i++) {
                const char = originalText[i];
                const tspan = document.createElementNS(svgNS, 'tspan');
                tspan.textContent = char;

                try {
                    // Check if getStartPositionOfChar is available and not null/undefined
                    if (textElement.getStartPositionOfChar && textElement.getStartPositionOfChar(i)) {
                         const pos = textElement.getStartPositionOfChar(i);
                         tspan.setAttribute('x', pos.x);
                         tspan.setAttribute('y', pos.y);
                    } else {
                         // Fallback or handle browsers where getStartPositionOfChar is not reliable
                         console.warn("getStartPositionOfChar not available or failed for character", i, "of text:", originalText);
                         // Basic fallback: add dx to position next character relative to the previous one
                         if (i > 0) {
                            tspan.setAttribute('dx', '0'); // You might need a more complex dx calculation here based on font metrics if needed
                         }
                    }


                } catch (e) {
                    console.warn("Could not get position for character", i, "of text:", originalText, e);
                    if (i > 0) {
                        tspan.setAttribute('dx', '0');
                    }
                }


                tspan.style.opacity = 0;

                animatedTextElement.appendChild(tspan);
                tspansForAnimation.push(tspan);
            }

            animatedTextElements.push(tspansForAnimation);
        });

        const typingTimeline = gsap.timeline({
            repeat: -1, // Infinite loop
            yoyo: true // Play forward then reverse
        });

        animatedTextElements.forEach(tspanArray => {
            if (tspanArray.length > 0) {
                typingTimeline.to(tspanArray, {
                    opacity: 1,
                    duration: 0.001,
                    stagger: {
                        each: 0.003, // Adjust for speed
                        from: "start"
                    },
                    ease: "none"
                }, ">"); // Use ">" to chain after the previous text block finishes typing in the timeline
            }
        });

    } else {
        console.warn("SVG element with ID 'svg20' for typing effect not found.");
    }


    // =====================================================
    // [8] SVG22 - Maze Dot Animation
    // =====================================================
    const svg22 = document.getElementById('svg22');

    if (svg22) {
        // The two dots we want to animate
        // Using attribute selectors - ensure these match the actual SVG
        const dot1 = svg22.querySelector('path[d^="M172.78,615.25"]'); // First dot
        const dot2 = svg22.querySelector('path[d^="M896.99,27.15"]'); // Second dot

        if (dot1 && dot2) {
            // Create path data for the first dot's movement
            const dot1PathData = createPathForDot1();

            // Create path data for the second dot's movement
            const dot2PathData = createPathForDot2();

            // Create hidden path elements that will guide our dots
            const dot1Path = createPathElement(svg22, dot1PathData, "dot1-path");
            const dot2Path = createPathElement(svg22, dot2PathData, "dot2-path");

            // Check if MotionPathPlugin is available before attempting to use it for SVG22
            if (gsap.plugins.motionPath) {
                 // Set up animations using motionPath
                 gsap.to(dot1, {
                     motionPath: {
                         path: dot1Path,
                         align: dot1Path,
                         autoRotate: false,
                         alignOrigin: [0.5, 0.5]
                     },
                     duration: 20,
                     ease: "none",
                     repeat: -1
                 });

                 gsap.to(dot2, {
                     motionPath: {
                         path: dot2Path,
                         align: dot2Path,
                         autoRotate: false,
                         alignOrigin: [0.5, 0.5]
                     },
                     duration: 25, // Different duration creates more varied movement patterns
                     ease: "none",
                     repeat: -1
                 });

                 // Optional: Add subtle pulsing effect to dots
                 gsap.to([dot1, dot2], {
                     scale: 1.2,
                     transformOrigin: "center center",
                     duration: 0.8,
                     yoyo: true,
                     repeat: -1,
                     ease: "sine.inOut",
                     stagger: 0.4 // Stagger the animation for a more natural feel
                 });
            } else {
                 console.warn("MotionPathPlugin is not registered. SVG22 dot animation skipped.");
            }

        } else {
            console.warn("Could not find the maze dots in SVG22! Check selectors.");
        }
    } else {
        console.warn("SVG22 element not found.");
    }

    // =====================================================
    // Helper Functions for SVG22
    // =====================================================

    // Create a new path element and add it to the SVG
    function createPathElement(svg, pathData, id) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("id", id);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "none"); // Make it invisible
        path.setAttribute("stroke-width", "0");
        svg.appendChild(path);
        return path;
    }

    // Create a path for dot1 to follow through the maze
    function createPathForDot1() {
        // Starting from bottom left dot position and creating a winding path through the maze
        return `
        M172.78,615.25
        L163.31,615.25
        L163.31,502.49
        L163.31,448.19
        L210.82,448.19
        L210.82,356.37
        L210.82,259.67
        L303.78,259.67
        L303.78,352.54
        L399.25,352.54
        L399.25,259.67
        L498.36,259.67
        L498.36,165.49
        L546.36,165.49
        L546.36,213.21
        L590.13,213.21
        L590.13,259.67
        L642,259.67
        L642,403.74
        L543.75,403.74
        L543.75,543.83
        L642,543.83
        L780.62,543.83
        L780.62,492.54
        L687.74,492.54
        L687.74,356.37
        L735.74,356.37
        L735.74,543.83
        L830.87,543.83
        L830.87,635.39
        L873.29,635.39
        L873.29,685.96
        L447.66,685.96
        L447.66,457.42
        L352.88,457.42
        L352.88,586.45
        L260.69,586.45
        L260.69,685.96
        L172.78,685.96
        L172.78,615.25
    `;
    }

    // Create a path for dot2 to follow through the maze
    function createPathForDot2() {
        // Starting from top right dot position and creating a different path through the maze
        return `
        M896.99,27.15
        L822.72,27.15
        L822.72,162.29
        L830.87,162.29
        L830.87,72.57
        L783.56,72.57
        L783.56,212.87
        L920.6,212.87
        L920.6,305.41
        L822.72,305.41
        L822.72,212.87
        L780.62,212.87
        L780.62,309.57
        L687.74,309.57
        L687.74,213.21
        L631.73,213.21
        L631.73,165.49
        L631.73,72.57
        L543.9,72.57
        L543.9,165.49
        L498.36,165.49
        L447.66,165.49
        L447.66,210.84
        L352.88,210.84
        L352.88,305.41
        L303.78,305.41
        L260.69,305.41
        L260.69,210.84
        L210.82,210.84
        L210.82,72.57
        L163.31,72.57
        L163.31,121.2
        L163.31,401.86
        L260.69,401.86
        L352.88,401.86
        L352.88,543.83
        L401.54,543.83
        L401.54,638.09
        L303.78,638.09
        L303.78,590.96
        L260.69,590.96
        L210.82,590.96
        L210.82,544.98
        L163.31,544.98
        L163.31,502.49
        L210.82,502.49
        L303.78,502.49
        L352.88,502.49
        L352.88,401.86
        L497.01,401.86
        L497.01,543.83
        L595.96,543.83
        L595.96,590.96
        L822.72,590.96
        L873.29,590.96
        L873.29,256.91
        L734.62,256.91
        L734.62,20.36
        L896.99,20.36
        L896.99,27.15
    `;
    }
    
    // =====================================================
    // [9] Text Hover Bounce Effect
    // =====================================================

    // Select all elements that should have the hover effect
    const bounceTextElements = document.querySelectorAll('.js-bounce-text'); // Use a class like 'js-bounce-text' in your HTML

    bounceTextElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = ''; // Clear the original text

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces to maintain layout
            span.style.display = 'inline-block'; // Needed for transform (y) to work reliably
            span.style.position = 'relative'; // Needed if using 'top' or 'bottom' instead of 'y'
            span.style.transformOrigin = 'center bottom'; // Bounce from the bottom
            // Add a class if you want to style the spans (optional)
            // span.classList.add('bounce-letter');

            // Add hover listeners to the span
            span.addEventListener('mouseenter', () => {
                 gsap.to(span, {
                     y: -10, // Bounce up by 10 pixels
                     duration: 0.3, // Duration of the bounce up and back down
                     yoyo: true, // Go back to the original position
                     repeat: 1, // Repeat once (up and down)
                     ease: "power1.out", // Bouncy ease
                     overwrite: true // Prevent conflicts if hovering rapidly
                 });
            });

            // Mouseleave is not strictly needed because yoyo/repeat handle the return,
            // but you could add one if you wanted to immediately kill the animation
            // or do something else on mouse out.
            // span.addEventListener('mouseleave', () => {
            //      gsap.killTweensOf(span); // Example: stops the animation immediately on mouse out
            // });


            element.appendChild(span); // Add the span to the original element
        }
        // Optional: Set cursor style for the whole element
        element.style.cursor = 'default';
    });
    // Custom cursor

    const crosshairH = document.querySelector('.crosshair-h');
    const crosshairV = document.querySelector('.crosshair-v');
    const centerDot = document.querySelector('.center-dot');

    window.addEventListener('mousemove', (e) => {
        gsap.to(crosshairH, {
            top: e.clientY - 2,
            duration: 0.05,
            ease: "power2.out"
        });
        gsap.to(crosshairV, {
            left: e.clientX - 2,
            duration: 0.05,
            ease: "power2.out"
        });
        gsap.to(centerDot, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.05,
            ease: "power2.out"
        });
    });

    document.body.addEventListener('mouseleave', () => {
        gsap.to([crosshairH, crosshairV, centerDot], {
            opacity: 0,
            duration: 0.3
        });
    });

    document.body.addEventListener('mouseenter', () => {
        gsap.to([crosshairH, crosshairV, centerDot], {
            opacity: 1,
            duration: 0.3
        });
    });
};