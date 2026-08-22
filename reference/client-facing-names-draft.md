# Client-Facing Task Names — Draft for Review

**R159 · drafted 2026-08-22 · REVIEW ONLY — nothing here has been written to ClickUp.**

Every row the client dashboard serves currently renders `label_source: "name"`, so the client
reads the raw internal task title. This file proposes a plain-language sentence for each one.
It is a proposal only: no custom field was written, and no internal task name was changed.
The internal name stays the system of record.

**Scope.** All 116 rows returned by `/v1/green/portal-dashboard` for the one populated client
board, across the five buckets. The p16 prompt anticipated 102 rows; the live endpoint returns
116, so this file covers 116.

**Conventions applied.** Lead with the due date as `Mmm D`, then an em dash, then the sentence.
Plain language; no statute citations; form numbers only where a client would recognise them
(Form 941, Form 2848, Form 433-B). Second person for anything requiring the client, third
person for anything that does not. Under 70 characters. Hedged verbs are preserved — the
internal "may begin" becomes "can begin", never "will begin".

**No names.** No client, company, staff, bank, lender, landlord or IRS-officer name appears in
any proposed label, and no account number or dollar figure. This file is committed to a repo
that Netlify serves publicly. Where the internal name embeds one, the proposal substitutes a
neutral phrase ("your bank", "your CFO", "your prior firm", "your landlord"). A generated
guard asserts this over every proposal before the file is written. Task ids are retained
deliberately — they carry no client identity. The `internal` column is verbatim and does
contain names; it is the reviewer's reference, and is the reason this file is a draft rather
than something served to a client.

**Confidence.** `low` marks a row whose internal name needed interpretation that could not be
made safely from the text alone. 10 of 116 are `low`, each with its reason below. A wrong `low`
costs a glance; a wrong `high` reaches a client.

| # | task_id | bucket | internal | proposed | confidence |
|---|---|---|---|---|---|
| 1 | `86e2wuffy` | secure_intake | Filing — 2023-04-30 — Form 941 (Employer's Quarterly Federal Tax Return), 2023 Q1 (Not A Summons Period) | Apr 30 — Form 941 payroll return, 2023 Q1 (not in the summons) | high |
| 2 | `86e2wufhy` | secure_intake | Filing — 2023-07-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2023 Q2 (Not A Summons Period) | Jul 31 — Form 941 payroll return, 2023 Q2 (not in the summons) | high |
| 3 | `86e2uk7b2` | secure_intake | Filing — 2023-10-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2023 Q3 (Period At Issue Per Summons) | Oct 31 — Form 941 payroll return, 2023 Q3 (in the summons) | high |
| 4 | `86e2ug862` | secure_intake | Filing — 2024-01-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2023 Q4 (Period At Issue Per Summons) | Jan 31 — Form 941 payroll return, 2023 Q4 (in the summons) | high |
| 5 | `86e2uk7c9` | secure_intake | Filing — 2024-04-30 — Form 941 (Employer's Quarterly Federal Tax Return), 2024 Q1 (Period At Issue Per Summons) | Apr 30 — Form 941 payroll return, 2024 Q1 (in the summons) | high |
| 6 | `86e2uk7ct` | secure_intake | Filing — 2024-07-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2024 Q2 (Period At Issue Per Summons) | Jul 31 — Form 941 payroll return, 2024 Q2 (in the summons) | high |
| 7 | `86e2uk7dq` | secure_intake | Filing — 2024-10-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2024 Q3 (Period At Issue Per Summons) | Oct 31 — Form 941 payroll return, 2024 Q3 (in the summons) | high |
| 8 | `86e2wtdud` | secure_intake | Filing — 2025-01-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2024 Q4 (Not A Summons Period) | Jan 31 — Form 941 payroll return, 2024 Q4 (not in the summons) | high |
| 9 | `86e2uk7f1` | secure_intake | Filing — 2025-04-30 — Form 941 (Employer's Quarterly Federal Tax Return), 2025 Q1 (Period At Issue Per Summons) | Apr 30 — Form 941 payroll return, 2025 Q1 (in the summons) | high |
| 10 | `86e2wtdwt` | secure_intake | Filing — 2025-07-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2025 Q2 (Not A Summons Period) | Jul 31 — Form 941 payroll return, 2025 Q2 (not in the summons) | high |
| 11 | `86e2ukzn9` | secure_intake | Filing — 2025-10-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2025 Q3 (Period At Issue Per Summons) | Oct 31 — Form 941 payroll return, 2025 Q3 (in the summons) | high |
| 12 | `86e2uk7gj` | secure_intake | Filing — 2026-01-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2025 Q4 (Period At Issue Per Summons) | Jan 31 — Form 941 payroll return, 2025 Q4 (in the summons) | high |
| 13 | `86e2wtdzg` | secure_intake | Filing — 2026-04-30 — Form 941 (Employer's Quarterly Federal Tax Return), 2026 Q1 (Not A Summons Period) | Apr 30 — Form 941 payroll return, 2026 Q1 (not in the summons) | high |
| 14 | `86e2ufkpv` | secure_intake | Summons — 2026-07-30 — IRS — 3rd Party Summons To Twin City Bank, 941 Records (Form 6639 rev. 3-2020) | Jul 30 — The IRS summons sent to your bank for payroll records | high |
| 15 | `86e2ufkrk` | secure_intake | Summons — 2026-07-30 — IRS — Third-Party Summons Notice To Taxpayer (Form 6639 rev. 3-2020) | Jul 30 — Your copy of the IRS summons notice | high |
| 16 | `86e2wte4m` | secure_intake | Filing — 2026-07-31 — Form 941 (Employer's Quarterly Federal Tax Return), 2026 Q2 (Not A Summons Period) | Jul 31 — Form 941 payroll return, 2026 Q2 (not in the summons) | high |
| 17 | `86e2ufknw` | secure_intake | Letter — 2026-08-10 — IRS — CDP Levy Hearing Acknowledged, 2025 Q1 941 (Letter 4837 rev. 4-2023) | Aug 10 — The IRS confirmed your levy hearing request | high |
| 18 | `86e2ujraf` | secure_intake | Letter — 2026-08-13 — Twin City Bank — Summons Records Production Cover Letter (re Form 6639) | Aug 13 — Your bank cover letter with the records it sent | high |
| 19 | `86e2unwm4` | secure_intake | Record — 2026-08-13 — Twin City Bank — Corporate Banking Resolution For Deposit Accounts (p1) | Aug 13 — The board resolution for your bank accounts | high |
| 20 | `86e2unwme` | secure_intake | Record — 2026-08-13 — Twin City Bank — Signature Card And Deposit Account Agreement (p3) | Aug 13 — Your signature card and account agreement | high |
| 21 | `86e2unwmw` | secure_intake | Record — 2026-08-13 — Twin City Bank — Superseded Signature Card Marked Copy (p3) | Aug 13 — The older signature card your bank replaced | high |
| 22 | `86e2unwnj` | secure_intake | Record — 2026-08-13 — Twin City Bank — Customer Identification Record For Authorized Signers (p4) | Aug 13 — Bank ID records for your authorized signers | high |
| 23 | `86e2unwpa` | secure_intake | Record — 2026-08-13 — Twin City Bank — TIN And Backup Withholding Certification (p4) | Aug 13 — Bank record certifying your company tax ID | low |
| 24 | `86e2unwq6` | secure_intake | Record — 2026-08-13 — Twin City Bank — FinCEN Certification Of Beneficial Owners (p5-p7) | Aug 13 — Bank record of your company owners | high |
| 25 | `86e2ujray` | secure_intake | Record — 2026-08-13 — Twin City Bank — Signature Card, Resolutions & Beneficial Ownership (Produced re Form 6639) | Aug 15 — Records your bank produced for the summons | low |
| 26 | `86e2wu7q7` | secure_intake | Record — 2026-08-18 — Klaritie Farms, Inc — Shared Folder (Access Provided by Kathleen Nash, Klaritie Farms, Inc) | Aug 18 — You shared your document folder with us | high |
| 27 | `86e2ufkgt` | deadlines | Deadline — 2026-08-19 — Petition To Quash Window Closes (re Twin City Bank Summons) | Aug 19 — Last day to challenge the bank summons in court | high |
| 28 | `86e2ufkhr` | deadlines | Deadline — 2026-08-22 — IRS May Begin Examining Summoned Bank Records (re Twin City Bank Summons) (§7609 23-Day Mark) | Aug 22 — The IRS can begin reading your bank records | high |
| 29 | `86e2ufkjn` | deadlines | Deadline — 2026-08-24 — Request Alternate CDP Conference Format (Letter 4837) | Aug 24 — Last day to ask for a different hearing format | high |
| 30 | `86e2w1yv7` | deadlines | Deadline — 2026-08-24 — IRS Appeals — Doc Request & Access To Administrative File (Letter 4837 14-Day Window) | Aug 24 — Last day to ask Appeals for your case file | high |
| 31 | `86e2ufkm2` | deadlines | Deadline — 2026-09-01 — Twin City Bank Summons Appearance / Production, 9:00a PT (RO John Hegi) | Sep 1 — Your bank must hand over the records, 9:00am PT | high |
| 32 | `86e2ufkn6` | deadlines | Hearing — 2026-09-08 — IRS — CDP Levy Hearing, Telephone 9:00a PT (Robert Strickle, Appeals Officer, Letter 4837) | Sep 8 — Your IRS levy hearing by phone, 9:00am PT | high |
| 33 | `86e2xeht4` | deadlines | Deadline — 2026-09-08 — IRS — CDP Levy Hearing, Telephone 9:00a PT (Robert Strickle, Appeals Officer, Letter 4837) | Sep 8 — Your IRS levy hearing by phone, 9:00am PT | high |
| 34 | `86e2ug72x` | deadlines | Deadline — 2027-03-31 — WA Annual Report / Registration Renewal Due (UBI 603484845) | Mar 31 — Your Washington annual business renewal is due | high |
| 35 | `86e2unwwr` | work_items | Staff Action — Audit Package (Next Steps Item 4) | Aug 10 — We are preparing your audit package | low |
| 36 | `86e2upjnf` | work_items | Work Item — 2026-08-13 — Twin City Bank — Bank Statements, Three Period Ranges (Item 1, Acct …2432) | Aug 13 — Bank statements for three periods, one account | low |
| 37 | `86e2upjnj` | work_items | Work Item — 2026-08-13 — Twin City Bank — Signature Card, Resolution & Beneficial Ownership (Item 2, Acct …2432) | Aug 13 — Signature card and ownership records for one account | low |
| 38 | `86e2upjnz` | work_items | Work Item — 2026-08-13 — Twin City Bank — Cancelled Checks, 5 Per Month, Three Period Ranges (Item 3, Acct …2432) | Aug 13 — Cancelled checks, five per month for three periods | low |
| 39 | `86e2upjpq` | work_items | Work Item — 2026-08-13 — Twin City Bank — Loan Applications, Bank Marked NA (Item 4, Acct …2432) (Not Applicable) | Aug 13 — Loan applications: your bank had none to send | high |
| 40 | `86e2upjq6` | work_items | Work Item — 2026-08-13 — Twin City Bank — Bank Statements, Three Period Ranges (Item 5, Acct …5925) | Aug 13 — Bank statements for three periods, one account | low |
| 41 | `86e2upjqh` | work_items | Work Item — 2026-08-13 — Twin City Bank — Signature Card, Resolution & Beneficial Ownership (Item 6, Acct …5925) | Aug 13 — Signature card and ownership records for one account | low |
| 42 | `86e2w1n3f` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Doc Request — Bank statements for the last six months | Aug 24 — We need your bank statements for the last six months | high |
| 43 | `86e2w1n3n` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Doc Request — Completed Form 433-B, Collection Information Statement for Businesses | Aug 24 — We need your completed Form 433-B statement | high |
| 44 | `86e2w1n42` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Doc Request — Installment agreement proposal | Aug 24 — We need your proposed payment plan | high |
| 45 | `86e2w1n4d` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Doc Request — Latest statement from all loan and investment accounts | Aug 24 — We need your latest loan and investment statements | high |
| 46 | `86e2w1n4p` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Doc Request — Profit and loss statement covering the last six months | Aug 24 — We need your profit and loss for the last six months | high |
| 47 | `86e2w1n4z` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Doc Request — Proof you timely deposited all federal employment taxes for the current quarter | Aug 24 — We need proof you paid this quarter payroll taxes | high |
| 48 | `86e2ujy24` | work_items | Work Item — 2026-07-30 — IRS — 3rd Party Summons To Twin City Bank — Bank Signature Cards (Form 6639 rev. 3-2020 Part C) | Sep 1 — Your bank must produce your signature cards | high |
| 49 | `86e2ujy2u` | work_items | Work Item — 2026-07-30 — IRS — 3rd Party Summons To Twin City Bank — Corporate Resolutions (Form 6639 rev. 3-2020 Part C) | Sep 1 — Your bank must produce your corporate resolutions | high |
| 50 | `86e2ujy3t` | work_items | Work Item — 2026-07-30 — IRS — 3rd Party Summons To Twin City Bank — Bank Statements (Form 6639 rev. 3-2020 Part C) | Sep 1 — Your bank must produce your bank statements | high |
| 51 | `86e2ujy4u` | work_items | Work Item — 2026-07-30 — IRS — 3rd Party Summons To Twin City Bank — Cancelled Checks, 5 Per Month, Fronts Only (Form 6639 rev. 3-2020 Part C) | Sep 1 — Your bank must produce cancelled check fronts | high |
| 52 | `86e2ujy5n` | work_items | Work Item — 2026-07-30 — IRS — 3rd Party Summons To Twin City Bank — Loan Applications, Agreements & Corporate Financial Statements (Form 6639 rev. 3-2020 Part C) | Sep 1 — Your bank must produce loan and financial records | high |
| 53 | `86e2w1xtr` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Whether the IRS met all the requirements of any applicable law or administrative procedure. | Sep 8 — Hearing topic: whether the IRS followed the rules | high |
| 54 | `86e2w1xtz` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Whether you owe the amount due | Sep 8 — Hearing topic: whether you owe the amount | high |
| 55 | `86e2w1xu9` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Any relevant issues you wish to discuss, including: | Sep 8 — Hearing topic: anything else you want to raise | high |
| 56 | `86e2w1xuy` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection alternatives to levy, such as: | Sep 8 — Hearing topic: alternatives to a levy | high |
| 57 | `86e2w1xv7` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Challenges to the appropriateness of collection action, including: | Sep 8 — Hearing topic: challenging how the IRS is collecting | high |
| 58 | `86e2w1xvf` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Spousal defenses, when applicable. | Sep 8 — Hearing topic: spousal relief, if it applies | high |
| 59 | `86e2w2mk1` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection alternative — Full payment of liability | Sep 8 — Hearing topic: paying the balance in full | high |
| 60 | `86e2w2mqr` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection alternative — Installment agreement | Sep 8 — Hearing topic: paying in monthly installments | high |
| 61 | `86e2w2n2p` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection alternative — Offer in compromise | Sep 8 — Hearing topic: settling for less than the full amount | high |
| 62 | `86e2w2urm` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection action challenges — Whether a notice of lien filing was appropriate | Sep 8 — Hearing topic: whether the lien should have been filed | high |
| 63 | `86e2w2v0k` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection action challenges — Whether you qualify for a notice of lien withdrawal | Sep 8 — Hearing topic: whether the lien can be withdrawn | high |
| 64 | `86e2w2v2z` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Collection action challenges — Other lien options | Sep 8 — Hearing topic: other options for handling the lien | high |
| 65 | `86e2w87vu` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Whether you owe the amount due: If you didn’t receive a statutory notice of deficiency | Sep 8 — Hearing topic: disputing the amount if no notice arrived | high |
| 66 | `86e2w87zy` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Whether you owe the amount due: If have not otherwise had an opportunity to dispute your liability with Appeals | Sep 8 — Hearing topic: disputing the amount if you never could | high |
| 67 | `86e2wqg4q` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Relevant Issue: Date of Determination Letter | Sep 8 — Hearing topic: when the decision letter is expected | high |
| 68 | `86e2wqghq` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Relevant Issue: CDP determination letter affect on Collection actions (will the matter be turned over to Collections) | Sep 8 — Hearing topic: whether the case goes back to Collections | high |
| 69 | `86e2wqgu9` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Relevant Issue: If negative determination, additional rights to appeal and affect on Tax Court's rights | Sep 8 — Hearing topic: your appeal rights if it goes against you | low |
| 70 | `86e2wqh5f` | work_items | Work Item — 2026-08-10 — IRS — CDP Levy Hearing: Discussion Item — Relevant Issue: Expected next Collection actions (levy and which assets) | Sep 8 — Hearing topic: what the IRS may try to collect next | high |
| 71 | `86e2ugrnn` | correspondence | Meeting — 2026-08-10 — Green Collar CFO/Klaritie Farms, IRS Review (Google Meet, 4–5p PT) | Aug 10 — Video call to review your IRS matter | high |
| 72 | `86e2um32e` | correspondence | Email — 2026-08-10 — Amber Canady — Direct Connect (Referral Intro) | Aug 10 — Your CFO introduced us | high |
| 73 | `86e2um339` | correspondence | Email — 2026-08-10 — Jamie Williams — Re: Direct Connect (Next Steps 1–5) | Aug 10 — We sent you the first five next steps | high |
| 74 | `86e2um343` | correspondence | Email — 2026-08-10 — Jamie Williams — Re: Direct Connect (Accounts Live) | Aug 10 — We confirmed your accounts were live | high |
| 75 | `86e2upbfb` | correspondence | Email — 2026-08-10 — Amber Canady — Klaritie Farms - Summons (Attachment(s)) | Aug 10 — Your CFO sent us the summons documents | high |
| 76 | `86e2um34q` | correspondence | Email — 2026-08-12 — Jamie Williams — Re: Direct Connect (Follow-Up) | Aug 12 — We followed up with you | high |
| 77 | `86e2um361` | correspondence | Email — 2026-08-12 — Jamie Williams — Re: Direct Connect (Acknowledged) | Aug 12 — We acknowledged your reply | high |
| 78 | `86e2upucv` | correspondence | Email — 2026-08-12 — Marty White — Re: Direct Connect (Bank Confirmed, Decision Tomorrow) | Aug 12 — You confirmed the bank details | high |
| 79 | `86e2um35m` | correspondence | Email — 2026-08-13 — Marty White — Re: Direct Connect (Attachment(s), We Will Hire You) | Aug 13 — You confirmed you were engaging us | high |
| 80 | `86e2upud6` | correspondence | Email — 2026-08-13 — Kathleen Nash — Re: Direct Connect (Portal Invite Not Received) | Aug 13 — You told us the portal invitation had not arrived | high |
| 81 | `86e2upude` | correspondence | Email — 2026-08-13 — Jamie Williams — Re: Direct Connect (Welcome Aboard, Payment And 2848) | Aug 13 — We welcomed you and asked for payment and Form 2848 | high |
| 82 | `86e2upudm` | correspondence | Email — 2026-08-13 — Jamie Williams — Re: Direct Connect (Portal Invite Sender Fix) | Aug 13 — We fixed the sender on your portal invitation | high |
| 83 | `86e2unwjd` | correspondence | Email — 2026-08-14 — Jamie Williams — Re: Bank Files (Records Received, Payment And 2848 Outstanding) | Aug 14 — We confirmed the records; payment and 2848 still due | high |
| 84 | `86e2updff` | correspondence | Email — 2026-08-14 — Marty White — Bank Files (Attachment(s)) | Aug 14 — You sent us your bank files | high |
| 85 | `86e2v9z7b` | correspondence | Email — 2026-08-17 — Kathleen Nash — SuiteDash (Portal Invite Not Found; Payment And Bank File Transfer) | Aug 17 — You asked about the portal invite, payment and files | high |
| 86 | `86e2v9zbf` | correspondence | Email — 2026-08-17 — Jamie Williams — Re: SuiteDash (Onboarding Call Booking Link Sent) | Aug 17 — We sent you a link to book your onboarding call | high |
| 87 | `86e2vjebn` | correspondence | Email — 2026-08-17 — Kathleen Nash — Re: SuiteDash (Bank Files Uploaded; Dashboard Would Not Load) | Aug 17 — You uploaded bank files and reported a portal problem | high |
| 88 | `86e2vjekc` | correspondence | Email — 2026-08-17 — Jamie Williams — Re: SuiteDash (Files Received; Portal Access Fixed, 2848 Outstanding) | Aug 17 — We fixed your portal access; Form 2848 still needed | high |
| 89 | `86e2w37v5` | correspondence | Email — 2026-08-18 — Kathleen Nash — IRS Form 2848 (Title Question For Marty's Signature) | Aug 18 — You asked how to complete the Form 2848 signature | high |
| 90 | `86e2w3846` | correspondence | Email — 2026-08-18 — Jamie Williams — Re: IRS Form 2848 (Leave Title Blank; Folder, Prior Reps, Check Register) | Aug 18 — We answered your Form 2848 question | high |
| 91 | `86e2w38fv` | correspondence | Email — 2026-08-18 — Kathleen Nash — Re: IRS Form 2848 (2848 Signed And Uploaded; Prior Reps, QBO/QBD Split) | Aug 18 — You uploaded the signed Form 2848 | high |
| 92 | `86e2w38tb` | correspondence | Email — 2026-08-18 — Jamie Williams — Re: IRS Form 2848 (Access And 2848 Confirmed; Stay Close, Portal Integrations) | Aug 18 — We confirmed your access and Form 2848 | high |
| 93 | `86e2wufwj` | correspondence | Email — 2026-08-18 — Kathleen Nash — Folder Shared With You: "Klaritie Farms" (Google Drive Access Granted) | Aug 18 — You shared your document folder with us | high |
| 94 | `86e2wn26v` | correspondence | Message — 2026-08-19 — Jamie Williams — Form 2848 Submitted To CAF, Executed Copy Delivered (SuiteDash Portal) | Aug 19 — We filed your Form 2848 and sent you a copy | high |
| 95 | `86e2wntzm` | correspondence | Email — 2026-08-19 — Kathleen Nash — Fwd: Virtual Launch Pro: New Private Message (How To Reply In Portal) | Aug 19 — You asked how to reply inside the portal | high |
| 96 | `86e2wnu89` | correspondence | Email — 2026-08-19 — Jamie Williams — Re: Virtual Launch Pro: New Private Message (Use Outreach & Support Team Inbox) | Aug 19 — We showed you which inbox to use | high |
| 97 | `86e2xcua7` | correspondence | Message — 2026-08-20 — Jamie Williams — Transcripts Are On File, Shared Folder, And Friday's Appointment (SuiteDash Portal) | Aug 20 — We confirmed your transcripts are on file | high |
| 98 | `86e2xe3zv` | correspondence | Message — 2026-08-20 — Jamie Williams — Voicemail To Confirm Friday's Meeting And Portal Message (Voicemail) | Aug 20 — We left you a voicemail confirming the meeting | high |
| 99 | `86e2xz231` | correspondence | Message — 2026-08-21 — Jamie Williams — Six Documents Due Monday, And Everything Else From Today's Meeting (SuiteDash Portal) | Aug 21 — We listed six documents due Monday after your meeting | high |
| 100 | `86e2unwu8` | client_requests | Client Request — Accounts And Portal Access (Next Steps Item 1, Completed, 2026-08-17, 2026-08-18) | Aug 10 — Your accounts and portal access (completed) | high |
| 101 | `86e2unwvb` | client_requests | Client Request — Diagnostic Payment (Next Steps Item 2, Completed, 2026-08-17) | Aug 10 — Your diagnostic payment (completed) | high |
| 102 | `86e2unww8` | client_requests | Client Request — Power Of Attorney Form 2848 (Next Steps Item 3, Completed, 2026-08-18) | Aug 10 — Your signed Form 2848 authorization (completed) | high |
| 103 | `86e2unwy9` | client_requests | Client Request — Twin City Bank Contact And Document Tracking (Next Steps Item 5, Ongoing) | Aug 10 — Tracking your bank contacts and documents (ongoing) | high |
| 104 | `86e2xvtaz` | client_requests | Client Request — eSign Doc — General Request — 3rd Party — 7216 Disclosure Consent — Klaritie Farms, Inc. — 21-Aug-2026 (Kathleen Nash, Pre-Meeting Same Day) | Aug 21 — We need your signed consent to share information | high |
| 105 | `86e2xz2zu` | client_requests | Client Request — Twin City Bank Visit Before The September 1 Summons (Marty Item 1) | Aug 24 — Visit your bank before the September 1 summons | high |
| 106 | `86e2xz30z` | client_requests | Client Request — Original Signed Form 433-B From Segal Cohen And Landis (Marty Item 2) | Aug 24 — We need the signed Form 433-B from your prior firm | high |
| 107 | `86e2xz31y` | client_requests | Client Request — Decision On Personal Representation For Trust Fund Recovery Penalty (Marty Item 4) | Aug 24 — We need your decision on personal representation | high |
| 108 | `86e2xz32m` | client_requests | Client Request — FundCanna (FC Capital) Loan Agreement And Latest Statements (Kathleen Item 2) | Aug 24 — We need your loan agreement and latest statements | high |
| 109 | `86e2xz338` | client_requests | Client Request — Rent Statement From D&C Lemmons LLC And Any Written Arrangement (Kathleen Item 3) | Aug 24 — We need your rent statement and any written lease | high |
| 110 | `86e2xz33y` | client_requests | Client Request — Client Review Questionnaire In The Offboarding Organizer (Kathleen Item 5) | Aug 24 — We need your completed client review questionnaire | low |
| 111 | `86e2xz34m` | client_requests | Client Request — Retainer Payment, $2,000 Monthly Representation Engagement (Kathleen Item 6) | Aug 24 — We need your monthly retainer payment | high |
| 112 | `86e2xz35d` | client_requests | Client Request — Budget Versus Actual And Cash Flow Testing $10,515 A Month (Amber Item 1) | Aug 24 — We need your budget, actuals and cash flow check | high |
| 113 | `86e2xz372` | client_requests | Client Request — Proof Of Timely Federal Employment Tax Deposits, Current Quarter (Amber Item 2, Appeals Doc Request Item 6) | Aug 24 — We need proof you paid this quarter payroll taxes | high |
| 114 | `86e2xz37n` | client_requests | Client Request — Profit And Loss, February Through July (Amber Item 3, Appeals Doc Request Item 5) | Aug 24 — We need your profit and loss for February to July | high |
| 115 | `86e2xz381` | client_requests | Client Request — Operating Expense Reductions And Vetted Refinancing Options (Amber Item 4) | Aug 24 — Review options to cut costs and refinance | high |
| 116 | `86e2xz31b` | client_requests | Client Request — Forward Twin City Documents, Determination Letter And Collection Action Details (Marty Item 3) | Sep 1 — We need your bank documents and IRS decision letter | high |

## Why each `low` is `low`

| task_id | reason |
|---|---|
| `86e2unwpa` | "TIN And Backup Withholding Certification" — the proposal renders the tax-ID half and drops "backup withholding", a term with no safe short plain-English equivalent. |
| `86e2ujray` | The row's due date (2026-08-15) and the date inside its own name (2026-08-13) disagree. The proposal leads with the due date; which one the client should see is an operator call. |
| `86e2unwwr` | "Audit Package (Next Steps Item 4)" — which audit, and whether a client should see an internal staff action at all, is not derivable from the name. |
| `86e2upjnf` | Wording collides with the other account's bank-statement item once the account identifier is removed. |
| `86e2upjnj` | Wording collides with the other account's signature-card item once the account identifier is removed. |
| `86e2upjnz` | Belongs to one specific account; the account identifier is withheld, so the label cannot distinguish it from its twin. |
| `86e2upjq6` | Same as above — two accounts, and the proposal cannot say which without naming the account. |
| `86e2upjqh` | Distinguishing this from its twin on the other account needs the account identifier, which is deliberately withheld from a client-facing label. |
| `86e2wqgu9` | Internal name reads "additional rights to appeal and affect on Tax Court's rights" — garbled, and the Tax Court element is dropped rather than guessed at. |
| `86e2xz33y` | "Client Review Questionnaire In The Offboarding Organizer" — an offboarding location for an active client looks wrong; the proposal drops the location rather than repeat it. |

## Open questions for the reviewer

1. **`Mmm D` carries no year.** Thirteen Form 941 rows span 2023–2026 and several share a day
   (`Apr 30`, `Jul 31`, `Oct 31`, `Jan 31`). The quarter in the sentence disambiguates them, but
   if the dashboard ever sorts or groups by the rendered label the year will need to appear.
2. **`86e2xeht4` and `86e2ufkn6` are the same event** — one filed as "Deadline —", one as
   "Hearing —", same date, same time, same officer. They get identical proposals. The
   duplication is in the source data, not in the drafting.
3. **`86e2wu7q7` and `86e2wufwj` describe the same folder share** in two different buckets
   (secure_intake and correspondence) and likewise get identical proposals.
4. **Six `Hearing topic:` rows are section headings, not items** — their internal names end in
   "including:" or "such as:". They are drafted as topics; if the dashboard cannot nest them
   they may read as redundant beside the items beneath them.
5. **Seven rows are internal work** — one `Staff Action` (`86e2unwwr`) and six bank work items.
   Whether these belong on a client-facing board at all is a product decision, not a copy one.
