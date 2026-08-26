/* =========================
   SHINE PORTFOLIO
   JAVASCRIPT
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const menuButton = document.querySelector(".menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (menuButton && mobileMenu) {

        menuButton.addEventListener("click", function () {

            mobileMenu.classList.toggle("active");
            menuButton.classList.toggle("active");

            const isOpen = mobileMenu.classList.contains("active");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });

        const mobileLinks = mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                mobileMenu.classList.remove("active");
                menuButton.classList.remove("active");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });
    }

    const navigationLinks =
        document.querySelectorAll('a[href^="#"]');

    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId =
                this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

    const style = document.createElement("style");

    style.textContent = `
        .menu-button span {
            transition:
                transform 0.3s ease,
                opacity 0.3s ease;
        }

        .menu-button.active span:nth-child(1) {
            transform: translateY(7px) rotate(45deg);
        }

        .menu-button.active span:nth-child(2) {
            opacity: 0;
        }

        .menu-button.active span:nth-child(3) {
            transform: translateY(-7px) rotate(-45deg);
        }
    `;

    document.head.appendChild(style);

    const header =
        document.querySelector(".header");

    if (header) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 30) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        });

    }

});
