// Public browser configuration only. Never place service-role or secret keys here.
const SUPABASE_URL = "https://gqowglwyumkzyhwxtxng.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_bCOv6eCVVhrIlDqR4MdNNA_tVW2fSCv";
const form = document.getElementById("apprentice-signin");
const message = document.getElementById("apprentice-message");
const params = new URLSearchParams(location.search);
const fragment = new URLSearchParams(location.hash.slice(1));
const token = params.get("access_token") || fragment.get("access_token");
const refresh = params.get("refresh_token") || fragment.get("refresh_token");
if (token || refresh) {
  message.textContent = "Sign-in link received. Please wait while your account is checked.";
  // The private dashboard will be enabled after administrator approval and access testing.
  history.replaceState(null, "", location.pathname);
}
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("apprentice-email").value.trim();
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  message.textContent = "Checking your request…";
  try {
    const response = await fetch(SUPABASE_URL + "/auth/v1/otp", {
      method: "POST",
      headers: {"Content-Type": "application/json", "apikey": PUBLISHABLE_KEY},
      body: JSON.stringify({
        email,
        create_user: false,
        email_redirect_to: new URL("apprentice-login.html", location.href).href
      })
    });
    if (!response.ok) throw new Error("Unable to request a link.");
    message.textContent = "If your email is already approved and registered, check your inbox for a sign-in link. Contact the school if you need access.";
  } catch (_) {
    message.textContent = "We could not complete that request. Contact the school to confirm your invitation.";
  } finally {
    button.disabled = false;
  }
});
