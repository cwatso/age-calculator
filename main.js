import "./style.scss";

const inputForm = document.getElementById("input-birthday");
const inputDay = document.getElementById("input-day-label");
const inputMonth = document.getElementById("input-month-label");
const inputYear = document.getElementById("input-year-label");
const outputDay = document.getElementById("output-days");
const outputMonth = document.getElementById("output-months");
const outputYear = document.getElementById("output-years");

function resetOutput() {
  outputDay.innerHTML = "--";
  outputMonth.innerHTML = "--";
  outputYear.innerHTML = "--";
}

function setError(field, message) {
  field.classList.add("error");
  field.querySelector("input").setAttribute("aria-invalid", true);
  field.querySelector(".error-message").innerHTML = `${message}`;
}

function clearError(field) {
  field.classList.remove("error");
  field.querySelector("input").setAttribute("aria-invalid", false);
  field.querySelector(".error-message").innerHTML = "";
}

function validateDate(day, month, year, currentDate) {
  let valid = false;

  function validateYear(year, currentDate) {
    if (year == null || year == "") {
      setError(inputYear, "This field is required");
    } else if (parseInt(year) > currentDate.getFullYear()) {
      setError(inputYear, "Must be in the past");
    } else {
      clearError(inputYear);
      return true;
    }
  }

  function validateMonth(month) {
    if (month == null || month == "") {
      setError(inputMonth, "This field is required");
    } else if (parseInt(month) > 12 || parseInt(month) < 1) {
      setError(inputMonth, "Must be a valid month");
    } else {
      clearError(inputMonth);
      return true;
    }
  }

  function validateDay(day) {
    if (day == null || day == "") {
      setError(inputDay, "This field is required");
    } else if (parseInt(day) > 31 || parseInt(day) < 1) {
      setError(inputDay, "Must be a valid day");
    } else {
      clearError(inputDay);
      return true;
    }
  }

  var validDay = validateDay(day);
  var validMonth = validateMonth(month);
  var validYear = validateYear(year, currentDate);

  if (validDay == true && validMonth == true && validYear == true) {
    let validatedDate = new Date(year, month - 1, day);
    if (validatedDate.getMonth() !== month - 1) {
      setError(inputDay, "Must be a valid date");
      setError(inputMonth, "");
      setError(inputYear, "");
    } else if (validatedDate > currentDate) {
      setError(inputYear, "Must be in the past");
    } else {
      clearError(inputDay);
      clearError(inputMonth);
      clearError(inputYear);
      valid = true;
    }
  }
  return valid;
}

function animateNumber(target, start, end, duration) {
  if (start === "--") {
    start = 0;
  }

  let startTimeStamp = null;

  const easing = (progress) => progress * (2 - progress);

  function step(timeStamp) {
    if (startTimeStamp === null) {
      startTimeStamp = timeStamp;
    }

    const progress = Math.min((timeStamp - startTimeStamp) / duration, 1);
    const easedProgress = easing(progress);
    target.innerHTML = Math.floor((end - start) * easedProgress + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(inputForm);
  var day = formData.get("input-day");
  var month = formData.get("input-month");
  var year = formData.get("input-year");

  const currentDate = new Date();

  resetOutput();

  var valid = validateDate(day, month, year, currentDate);
  if (valid) {
    let birthdayDate = new Date(year, month - 1, day);

    const february =
      (birthdayDate.getFullYear() % 4 === 0 &&
        birthdayDate.getFullYear() % 100 !== 0) ||
      birthdayDate.getFullYear() % 400 === 0
        ? 29
        : 28;
    const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let days = currentDate.getDate() - birthdayDate.getDate();
    let months = currentDate.getMonth() - birthdayDate.getMonth();
    let years = currentDate.getFullYear() - birthdayDate.getFullYear();

    if (months < 0) {
      years--;
      months += 12;
    }
    if (days < 0) {
      if (months > 0) {
        months--;
      } else {
        years--;
        months = 11;
      }
      days += daysInMonth[birthdayDate.getMonth()];
    }

    animateNumber(outputDay, outputDay.innerHTML, days, 1000);
    animateNumber(outputMonth, outputMonth.innerHTML, months, 1000);
    animateNumber(outputYear, outputYear.innerHTML, years, 1000);
  }
});
