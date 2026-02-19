export const groupOpeningHours = (openingHours) => {
    if (!openingHours) return [];

    const dayOrder = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
    ];

    const dayLabels = {
        monday: 'Pondělí',
        tuesday: 'Úterý',
        wednesday: 'Středa',
        thursday: 'Čtvrtek',
        friday: 'Pátek',
        saturday: 'Sobota',
        sunday: 'Neděle',
    };

    const todayIndex = (new Date().getDay() + 6) % 7; // Convert 0=Sun..6=Sat to 0=Mon..6=Sun
    const todayKey = dayOrder[todayIndex];

    const groups = [];
    let currentGroup = null;

    dayOrder.forEach((dayKey, index) => {
        const hours = openingHours[dayKey];
        const isOpen = hours && hours.open && hours.close;
        const timeLabel = isOpen ? `${hours.open} — ${hours.close}` : 'Zavřeno';

        // Check if this day matches the current group's time
        if (currentGroup && currentGroup.timeLabel === timeLabel) {
            currentGroup.endDay = dayLabels[dayKey];
            currentGroup.days.push(dayKey);
            if (dayKey === todayKey) currentGroup.isToday = true;
        } else {
            // Start a new group
            if (currentGroup) groups.push(currentGroup);
            currentGroup = {
                startDay: dayLabels[dayKey],
                endDay: null, // Will be set if group extends
                timeLabel,
                isClosed: !isOpen,
                isToday: dayKey === todayKey,
                days: [dayKey]
            };
        }
    });

    if (currentGroup) groups.push(currentGroup);

    // Format the label for final display
    return groups.map(group => {
        const label = group.endDay
            ? `${group.startDay} — ${group.endDay}`
            : group.startDay;

        return {
            label,
            time: group.timeLabel,
            isClosed: group.isClosed,
            isToday: group.isToday
        };
    });
};
