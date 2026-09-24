# Public calendar maintenance

The website calendar is a manually reviewed public selection, not an embedded Google Calendar or a live sync. Google Calendar remains the editing source. Keep personal appointments, partner planning, staff training, and private meetings out of public-calendar.js.

## Each weekly review

1. Check the school's current calendar for confirmed **public** Yoga For Life classes, YAGI open days, and special events that visitors are invited to attend. Confirm venue, start/end time in America/Chicago, recurrence, weather or accessibility notes, and RSVP applicability.
2. Update the series in public-calendar.js for weekly events. Change `first`, `count`, `hour`, `minute`, `duration`, and `place` only after confirming the source event. A canceled date requires an exception or removal; don't leave the generated occurrence live.
3. For a special gathering, add an individually confirmed event entry rather than inventing recurrence. Add a map venue only when its location is verified. Retain public RSVP and post-session check-in links on cards and map popups.
4. Recheck the America/Chicago daylight-saving offset logic when a series crosses a transition, and test Google and Apple calendar exports.
5. Update the reviewed-on date and coverage wording in calendar.html and the JS header; verify the site on a phone. Repeat after every public schedule change, even if the regular weekly review has already happened.

A public-only calendar feed could eventually automate this. Never embed the founder's primary calendar or publish its private event feed.
