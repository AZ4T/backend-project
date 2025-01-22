exports.getFormattedDateTime = () => {
    // Array of month names indexed 0-11
    const months = [
        "January", "February", "March", "April",  "May",       "June",
        "July",    "August",   "September", "October", "November", "December"
    ];

    const now = new Date();

    // Helper to zero-pad values under 10
    function pad(value) {
        return value.toString().padStart(2, '0');
    }

    const monthName = months[now.getMonth()];
    const day = now.getDate();             // No zero-pad if you want e.g. "8" instead of "08"
    const year = now.getFullYear();
    const hours = pad(now.getHours());     // 00-23
    const minutes = pad(now.getMinutes()); // 00-59
    const seconds = pad(now.getSeconds()); // 00-59

    // Format: "MonthName Day Year, HH:MM:SS"
    return `${monthName} ${day} ${year}, ${hours}:${minutes}:${seconds}`;
}
