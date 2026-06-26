const password = document.getElementById("password");
const toggleBtn = document.getElementById("toggleBtn");

const bar = document.getElementById("bar");

const strengthText = document.getElementById("strengthText");
const entropyScore = document.getElementById("entropyScore");
const securityLevel = document.getElementById("securityLevel");
const crackTime = document.getElementById("crackTime");

const emoji = document.getElementById("emoji");
const message = document.getElementById("message");

const lengthCheck = document.getElementById("lengthCheck");
const upperCheck = document.getElementById("upperCheck");
const lowerCheck = document.getElementById("lowerCheck");
const numberCheck = document.getElementById("numberCheck");
const specialCheck = document.getElementById("specialCheck");

toggleBtn.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";
        toggleBtn.textContent = "🐵";

    }
    else{

        password.type = "password";
        toggleBtn.textContent = "🙈";

    }

});

password.addEventListener("input", checkPassword);

function checkPassword(){

    const value = password.value;

    const hasLength = value.length >= 8;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    updateChecklist(
        hasLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
    );

    if(value.length === 0){

        resetUI();
        return;
    }

    let score = 0;

    if(hasLength) score += 20;
    if(hasUpper) score += 15;
    if(hasLower) score += 15;
    if(hasNumber) score += 15;
    if(hasSpecial) score += 15;

    if(value.length >= 12) score += 10;
    if(value.length >= 16) score += 10;

    let warnings = [];

    const lowerPassword = value.toLowerCase();

    const commonPasswords = [
        "password",
        "admin",
        "welcome",
        "qwerty",
        "letmein",
        "123456",
        "password123"
    ];

    commonPasswords.forEach(word => {

        if(lowerPassword.includes(word)){

            score -= 25;

            warnings.push(
                `⚠ Contains common password pattern (${word})`
            );

        }

    });

    if(/(.)\1{3,}/.test(value)){

        score -= 20;

        warnings.push(
            "⚠ Too many repeated characters"
        );
    }

    const sequences = [
        "123456",
        "abcdef",
        "qwerty",
        "asdfgh",
        "987654"
    ];

    sequences.forEach(seq => {

        if(lowerPassword.includes(seq)){

            score -= 15;

            warnings.push(
                "⚠ Sequential pattern detected"
            );

        }

    });

    if(/(.{2,})\1+/.test(lowerPassword)){

        score -= 15;

        warnings.push(
            "⚠ Repeated word pattern detected"
        );

    }

    score = Math.max(0, Math.min(score, 100));

    entropyScore.textContent = `${score} / 100`;

    if(score < 30){
        crackTime.textContent = "Instantly Crackable";
    }
    else if(score < 50){
        crackTime.textContent = "Few Minutes";
    }
    else if(score < 70){
        crackTime.textContent = "Several Days";
    }
    else if(score < 90){
        crackTime.textContent = "Several Years";
    }
    else{
        crackTime.textContent = "Millions of Years";
    }

    updateStrength(score, warnings);
}

function updateChecklist(
    hasLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
){

    lengthCheck.innerHTML =
    hasLength ? "✅ 8+ Characters" : "❌ 8+ Characters";

    upperCheck.innerHTML =
    hasUpper ? "✅ Uppercase Letter" : "❌ Uppercase Letter";

    lowerCheck.innerHTML =
    hasLower ? "✅ Lowercase Letter" : "❌ Lowercase Letter";

    numberCheck.innerHTML =
    hasNumber ? "✅ Number" : "❌ Number";

    specialCheck.innerHTML =
    hasSpecial ? "✅ Special Character" : "❌ Special Character";
}

function updateStrength(score, warnings){

    if(score < 40){

        emoji.textContent = "🤡";
        emoji.className = "weak";

        strengthText.textContent = "Strength: Weak";
        securityLevel.textContent = "Weak";

        bar.style.width = "35%";
        bar.style.background = "#ef4444";

        message.textContent =
        warnings.length > 0 ?
        warnings[0] :
        "Bro, hackers won't even need software.";
    }

    else if(score < 75){

        emoji.textContent = "😎";
        emoji.className = "medium";

        strengthText.textContent = "Strength: Medium";
        securityLevel.textContent = "Medium";

        bar.style.width = "70%";
        bar.style.background = "#f59e0b";

        message.textContent =
        warnings.length > 0 ?
        warnings[0] :
        "Getting there, but still vulnerable.";
    }

    else{

        emoji.textContent = "🗿";
        emoji.className = "strong";

        strengthText.textContent = "Strength: Strong (GigaChad)";
        securityLevel.textContent = "Strong";

        bar.style.width = "100%";
        bar.style.background = "#22c55e";

        message.textContent =
        warnings.length > 0 ?
        warnings[0] :
        "This password fears no brute-force attack.";
    }
}

function resetUI(){

    bar.style.width = "0%";
    bar.style.background = "#64748b";

    emoji.textContent = "🔐";
    emoji.className = "waiting";

    strengthText.textContent = "Awaiting Analysis";
    securityLevel.textContent = "-";

    entropyScore.textContent = "0 / 100";
    crackTime.textContent = "-";

    message.textContent =
    "Awaiting Password Analysis...";
}