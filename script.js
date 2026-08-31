/* =========================================================
   EDUCATIONAL EXPERT
   SERVICE REQUEST + WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", function () {

      const isOpen = navLinks.classList.toggle("open");

      menuBtn.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });


    /* Close mobile menu after clicking a link */

    navLinks.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        navLinks.classList.remove("open");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

      });

    });

  }


  /* =======================================================
     SERVICE REQUEST MODAL
  ======================================================= */

  const modal = document.getElementById("serviceModal");

  const openButton = document.getElementById("openServiceForm");

  const openBottomButton =
    document.getElementById("openServiceFormBottom");

  const closeButton =
    document.getElementById("closeServiceForm");

  const overlay =
    document.querySelector(".service-modal-overlay");

  const successCloseButton =
    document.getElementById("successCloseBtn");


  /* =======================================================
     FORM ELEMENTS
  ======================================================= */

  const form =
    document.getElementById("serviceRequestForm");

  const successMessage =
    document.getElementById("serviceSuccess");

  const submitButton =
    document.getElementById("serviceSubmitBtn");

  const serviceError =
    document.getElementById("serviceError");


  /* =======================================================
     OPEN MODAL
  ======================================================= */

  function openServiceModal() {

    if (!modal) return;

    modal.classList.add("active");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add("modal-open");

    /*
      Put keyboard focus on the first field
      after the animation/frame.
    */

    setTimeout(function () {

      const firstInput =
        document.getElementById("fullName");

      if (firstInput) {
        firstInput.focus();
      }

    }, 100);

  }


  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  function closeServiceModal() {

    if (!modal) return;

    modal.classList.remove("active");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove("modal-open");

  }


  /* =======================================================
     OPEN BUTTONS
  ======================================================= */

  if (openButton) {

    openButton.addEventListener(
      "click",
      openServiceModal
    );

  }


  if (openBottomButton) {

    openBottomButton.addEventListener(
      "click",
      openServiceModal
    );

  }


  /* =======================================================
     CLOSE BUTTON
  ======================================================= */

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeServiceModal
    );

  }


  /* =======================================================
     CLICK OUTSIDE MODAL
  ======================================================= */

  if (overlay) {

    overlay.addEventListener(
      "click",
      closeServiceModal
    );

  }


  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        modal &&
        modal.classList.contains("active")
      ) {

        closeServiceModal();

      }

    }
  );


  /* =======================================================
     SERVICE SELECTION
  ======================================================= */

  const serviceCheckboxes =
    document.querySelectorAll(
      'input[name="services[]"]'
    );


  serviceCheckboxes.forEach(function (checkbox) {

    checkbox.addEventListener(
      "change",
      function () {

        /*
          Remove error once the client
          selects a service.
        */

        const selectedServices =
          document.querySelectorAll(
            'input[name="services[]"]:checked'
          );

        if (
          selectedServices.length > 0 &&
          serviceError
        ) {

          serviceError.classList.remove(
            "show"
          );

        }

      }
    );

  });


  /* =======================================================
     EMAIL VALIDATION
  ======================================================= */

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );

  }


  /* =======================================================
     WHATSAPP VALIDATION
  ======================================================= */

  function isValidWhatsApp(number) {

    /*
      Allows:

      +923001234567
      03001234567
      +1 555 123 4567

      We keep this reasonably flexible because
      clients may be from different countries.
    */

    const cleaned =
      number.replace(/[\s\-()]/g, "");

    return /^\+?[0-9]{8,15}$/.test(
      cleaned
    );

  }


  /* =======================================================
     FORM SUBMISSION
  ======================================================= */

  if (form) {

    form.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        /* -----------------------------------------------
           CHECK SERVICES
        ------------------------------------------------ */

        const selectedServices =
          document.querySelectorAll(
            'input[name="services[]"]:checked'
          );


        if (
          selectedServices.length === 0
        ) {

          if (serviceError) {

            serviceError.classList.add(
              "show"
            );

            serviceError.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }

          return;

        }


        /* -----------------------------------------------
           CHECK EMAIL
        ------------------------------------------------ */

        const emailInput =
          document.getElementById("email");


        if (
          emailInput &&
          !isValidEmail(emailInput.value.trim())
        ) {

          emailInput.focus();

          alert(
            "Please enter a valid email address."
          );

          return;

        }


        /* -----------------------------------------------
           CHECK WHATSAPP
        ------------------------------------------------ */

        const whatsappInput =
          document.getElementById("whatsapp");


        if (
          whatsappInput &&
          !isValidWhatsApp(
            whatsappInput.value.trim()
          )
        ) {

          whatsappInput.focus();

          alert(
            "Please enter a valid WhatsApp number, including your country code."
          );

          return;

        }


        /* -----------------------------------------------
           START LOADING
        ------------------------------------------------ */

        if (submitButton) {

          submitButton.disabled = true;

          submitButton.classList.add(
            "loading"
          );

        }


        try {

          /* ---------------------------------------------
             CREATE FORM DATA
          --------------------------------------------- */

          const formData =
            new FormData(form);


          /*
            Create a readable list of selected services.

            Example:

            Web Development
            Thesis
            Research Paper
          */

          const serviceNames =
            Array.from(
              selectedServices
            )
            .map(function (checkbox) {
              return checkbox.value;
            })
            .join(", ");


          /*
            Add a combined service list.

            This makes the notification easier
            to read on the receiving side.
          */

          formData.append(
            "selected_services",
            serviceNames
          );


          /* ---------------------------------------------
             SEND TO FORMSPREE
          --------------------------------------------- */

          const response =
            await fetch(
              form.action,
              {
                method: "POST",

                body: formData,

                headers: {
                  "Accept":
                    "application/json"
                }
              }
            );


          /* ---------------------------------------------
             SUCCESS
          --------------------------------------------- */

          if (response.ok) {

            form.style.display =
              "none";


            if (successMessage) {

              successMessage.classList.add(
                "active"
              );

            }


            /*
              Scroll modal back to top.
            */

            if (modal) {

              modal.scrollTop = 0;

            }


            /*
              Reset form so that if the user
              opens it again, it is empty.
            */

            form.reset();


            if (serviceError) {

              serviceError.classList.remove(
                "show"
              );

            }

          }


          /* ---------------------------------------------
             SERVER ERROR
          --------------------------------------------- */

          else {

            let errorMessage =
              "Something went wrong while submitting your request.";

            try {

              const data =
                await response.json();

              if (
                data &&
                data.errors &&
                data.errors.length
              ) {

                errorMessage =
                  data.errors
                    .map(
                      function (error) {
                        return error.message;
                      }
                    )
                    .join("\n");

              }

            }

            catch (error) {

              /*
                Keep default error message.
              */

            }


            alert(
              errorMessage +
              "\n\nPlease try again or contact us directly."
            );

          }

        }


        /* -----------------------------------------------
           CONNECTION ERROR
        ------------------------------------------------ */

        catch (error) {

          console.error(
            "Service request error:",
            error
          );


          alert(
            "We could not submit your request right now.\n\nPlease check your internet connection and try again."
          );

        }


        /* -----------------------------------------------
           STOP LOADING
        ------------------------------------------------ */

        finally {

          if (submitButton) {

            submitButton.disabled = false;

            submitButton.classList.remove(
              "loading"
            );

          }

        }

      }
    );

  }


  /* =======================================================
     SUCCESS MESSAGE CLOSE
  ======================================================= */

  if (successCloseButton) {

    successCloseButton.addEventListener(
      "click",
      function () {

        if (successMessage) {

          successMessage.classList.remove(
            "active"
          );

        }


        if (form) {

          form.style.display =
            "block";

          form.reset();

        }


        closeServiceModal();

      }
    );

  }


  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const targetId =
            this.getAttribute("href");


          if (
            !targetId ||
            targetId === "#"
          ) {

            return;

          }


          const target =
            document.querySelector(
              targetId
            );


          if (target) {

            event.preventDefault();

            target.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }

        }
      );

    });

});
