export class DateUtil {
    static DEFAULT_OPTIONS = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: null,
        hour12: false // Use AM/PM format
    };

    static formatDateTime(timestamp, forceLocale = null, forceTimezone = null, customOptions = {}) {
        if (!timestamp) return '';

        // Use the forced locale and timezone if provided, otherwise detect from browser settings
        const resolvedLocale = forceLocale || Intl.DateTimeFormat().resolvedOptions().locale;
        const resolvedTimezone = forceTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            return "Invalid time"; 
        }

        const finalOptions = {
            ...DateUtil.DEFAULT_OPTIONS, // Start with defaults
            timeZone: resolvedTimezone,  // Apply the detected timezone
            ...customOptions             // Apply user overrides last
        };

        return date.toLocaleDateString(resolvedLocale, finalOptions);
    }
}