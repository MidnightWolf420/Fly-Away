document.addEventListener('DOMContentLoaded', async() => {
    const noRedirectButton = document.querySelector("#redirect-btn");
    let isActive = await sendGetRedirectState();
    if(noRedirectButton) {
        setRedirectState(noRedirectButton, isActive);
        noRedirectButton.addEventListener("click", async function () {
            noRedirectButton.classList.toggle("active");
            let currentResult = await sendGetRedirectState();
            const newState = !currentResult || !noRedirectButton.classList.contains("active");
            await setRedirectState(noRedirectButton, newState, true);
        });
    }
});

async function setRedirectState(element, state = true, changeStorage = false) {
    if(element) {
        if (state) {
            element.classList.add("active");
            element.setAttribute("aria-pressed", "true");
            if (changeStorage) {
                try {
                    await browser.storage.local.set({ redirect: state });
                    console.log(`Redirect state set to ${state}`);
                } catch (error) {
                    console.error("Error saving redirect state:", error);
                }
            }
        } else {
            element.classList.remove("active");
            element.setAttribute("aria-pressed", "false");
            if (changeStorage) {
                try {
                    await browser.storage.local.set({ redirect: state });
                    console.log(`Redirect state set to ${state}`);
                } catch (error) {
                    console.error("Error saving redirect state:", error);
                }
            }
        }
    }
}

async function sendGetRedirectState() {
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ action: "getRedirect" }).then((response) => {
            resolve(response.redirect !== undefined ? response.redirect : true)
        }).catch((error) => {
            resolve(true)
        });
    })
}

async function sendSetRedirectState(state) {
    return new Promise((resolve, reject) => {
        browser.runtime.sendMessage({ action: "setRedirect", redirect: state }).then((response) => {
            if (response.success) {
                console.log("Redirect state saved successfully.");
            }
        }).catch((error) => {
            console.error("Error saving redirect state:", error);
        });
    })
}