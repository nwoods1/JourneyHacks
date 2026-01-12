##Inspiration##
As schedules get busier, staying in touch with friends becomes harder—not because people don’t want to meet, but because coordinating time is difficult. Group chats and calendars exist, but they often require back-and-forth and mental overhead just to find a time that works. We wanted to build a simple tool that makes scheduling with friends more visual and less frustrating.

##What it does
Friendloop is a scheduling app that helps groups find feasible meeting times by considering both availability and social constraints. Users can mark when they’re free. The system then filters out time slots that don’t satisfy those constraints, showing only options that actually work for the intended group.

##How we built it
We built Friendloop as a web-based calendar application. Availability is represented as time blocks on a weekly calendar, and events are rendered dynamically in the UI. The frontend focuses on clear visualization of availability, while the underlying logic handles time ranges, overlaps, and event updates.

##Challenges we ran into
One of the main challenges was correctly handling time data. Representing availability using time ranges introduced edge cases such as partial overlaps, missing availability, and consistent behavior across days and time zones. Designing the UI to clearly communicate availability without overwhelming the user was also a challenge.

##Accomplishments that we're proud of
Successfully visualizing multiple users’ availability in a single view

Handling time ranges and overlaps reliably in the frontend

Creating realistic mock data to simulate real scheduling scenarios

##What we learned
We learned that even simple scheduling involves more complexity than it appears. Handling time correctly and presenting it clearly requires careful design. We also gained experience turning a basic idea into a working product under time constraints.

##What's next for Friendloop
Next, we plan to add persistent user accounts, backend storage for availability, and real-time collaboration. We also want to explore adding scheduling constraints and smarter suggestions once the core experience is solid.



