import type { Team, Question, RoundDetails } from './types';

export const initialTeams: Team[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Team ${String.fromCharCode(65 + i)}`,
  score: 0,
  status: 'active',
}));

// Round 1: Basic Computer Concepts
const round1Questions: Question[] = [
    {
        id: 101,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is the smallest unit of information in a computer?',
        options: [ 'Byte', 'Bit', 'Kilobyte', 'Word' ],
        answer: 'Bit',
        status: 'available'
    },
    {
        id: 102,
        round: 1,
        type: 'mcq',
        content: 'Which of the following memory types is volatile, meaning it loses its data when the power is turned off?',
        options: [ 'ROM', 'RAM', 'Hard Disk', 'SSD' ],
        answer: 'RAM',
        status: 'available'
    },
    {
        id: 103,
        round: 1,
        type: 'mcq',
        content: 'Which number system do computers use to process and store data?',
        options: [ 'Decimal', 'Binary', 'Octal', 'Hexadecimal' ],
        answer: 'Binary',
        status: 'available'
    },
    {
        id: 104,
        round: 1,
        type: 'mcq',
        content: 'Which type of software controls the overall working of the computer and manages hardware and software resources?',
        options: [ 'Operating System', 'Utility Software', 'Application Software', 'Firmware' ],
        answer: 'Operating System',
        status: 'available'
    },
    {
        id: 105,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is an example of a cloud storage service widely used for both personal and business purposes?',
        options: [ 'Dropbox', 'Oracle', 'Visual Studio', 'Linux' ],
        answer: 'Dropbox',
        status: 'available'
    },
    {
        id: 106,
        round: 1,
        type: 'mcq',
        content: 'Which type of malware is designed to demand payment from users by locking their files or system?',
        options: [ 'Virus', 'Worm', 'Ransomware', 'Spyware' ],
        answer: 'Ransomware',
        status: 'available'
    },
    {
        id: 107,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a type of software that helps manage business operations, such as accounting, sales, and inventory?',
        options: [ 'ERP (Enterprise Resource Planning)', 'Antivirus', 'Graphic Design Software', 'Text Editor' ],
        answer: 'ERP (Enterprise Resource Planning)',
        status: 'available'
    },
    {
        id: 108,
        round: 1,
        type: 'mcq',
        content: 'Which of the following network types is typically used to connect computers within a single building or campus?',
        options: [ 'LAN (Local Area Network)', 'WAN (Wide Area Network)', 'MAN (Metropolitan Area Network)', 'VPN (Virtual Private Network)' ],
        answer: 'LAN (Local Area Network)',
        status: 'available'
    },
    {
        id: 109,
        round: 1,
        type: 'mcq',
        content: 'Which of the following platforms is primarily used for professional networking and career development?',
        options: [ 'Instagram', 'LinkedIn', 'Facebook', 'Twitter' ],
        answer: 'LinkedIn',
        status: 'available'
    },
    {
        id: 110,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is the main purpose of a firewall in computer networks?',
        options: [ 'To cool down the CPU', 'To protect a network from unauthorized access', 'To speed up internet connections', 'To manage files on a hard disk' ],
        answer: 'To protect a network from unauthorized access',
        status: 'available'
    },
    {
        id: 111,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is an example of cloud-based office software that allows editing documents online?',
        options: [ 'MS Word (offline)', 'Google Docs', 'Notepad', 'Paint' ],
        answer: 'Google Docs',
        status: 'available'
    },
    {
        id: 112,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a primary function of an operating system?',
        options: [ 'Compile programs', 'Manage hardware resources', 'Create graphics', 'Design websites' ],
        answer: 'Manage hardware resources',
        status: 'available'
    },
    {
        id: 113,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a widely used software for data analysis and visualization in business and IT?',
        options: [ 'Tableau', 'Power BI', 'QlikView', 'Excel' ],
        answer: 'Tableau',
        status: 'available'
    },
    {
        id: 114,
        round: 1,
        type: 'mcq',
        content: 'Which of the following programming languages is primarily used for statistical computing and data analysis?',
        options: [ 'Python', 'R', 'MATLAB', 'SAS' ],
        answer: 'R',
        status: 'available'
    },
    {
        id: 115,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a primary function of spreadsheet software in business and IT?',
        options: [ 'Data entry and calculations', 'Image editing', 'Video rendering', 'Network management' ],
        answer: 'Data entry and calculations',
        status: 'available'
    },
    {
        id: 116,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a protocol used to securely transfer files over the internet?',
        options: [ 'FTP', 'SFTP', 'HTTP', 'Telnet' ],
        answer: 'SFTP',
        status: 'available'
    },
    {
        id: 117,
        round: 1,
        type: 'mcq',
        content: 'Which of the following software tools is commonly used for managing relational databases in business and IT?',
        options: [ 'MySQL', 'PostgreSQL', 'Oracle Database', 'Microsoft SQL Server' ],
        answer: 'MySQL',
        status: 'available'
    },
    {
        id: 118,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a type of non-volatile memory used to store firmware in computers?',
        options: [ 'ROM', 'RAM', 'Cache', 'Registers' ],
        answer: 'ROM',
        status: 'available'
    },
    {
        id: 119,
        round: 1,
        type: 'mcq',
        content: 'Which of the following devices is used to convert digital signals to analog signals for transmission over telephone lines?',
        options: [ 'Modem', 'Router', 'Switch', 'Hub' ],
        answer: 'Modem',
        status: 'available'
    },
    {
        id: 120,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a type of software that helps detect and remove viruses from a computer?',
        options: [ 'Antivirus', 'Firewall', 'Compiler', 'Text Editor' ],
        answer: 'Antivirus',
        status: 'available'
    },
    {
        id: 121,
        round: 1,
        type: 'mcq',
        content: 'Which of the following software is widely used for accounting and financial management in businesses?',
        options: [ 'Tally ERP 9', 'QuickBooks', 'Zoho Books', 'Sage 50' ],
        answer: 'Tally ERP 9',
        status: 'available'
    },
    {
        id: 122,
        round: 1,
        type: 'mcq',
        content: 'Which of the following office software is primarily used for data analysis, charting, and financial calculations?',
        options: [ 'MS Excel', 'Google Sheets', 'LibreOffice Calc', 'WPS Spreadsheets' ],
        answer: 'MS Excel',
        status: 'available'
    },
    {
        id: 123,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a primary function of presentation software in academics and business?',
        options: [ 'Creating slides with text, images, and charts', 'Designing databases', 'Performing complex calculations', 'Writing programming code' ],
        answer: 'Creating slides with text, images, and charts',
        status: 'available'
    },
    {
        id: 124,
        round: 1,
        type: 'mcq',
        content: 'Which of the following software tools is commonly used to prepare professional reports, brochures, and presentations in business?',
        options: [ 'MS Publisher', 'Canva', 'Adobe InDesign', 'Scribus' ],
        answer: 'MS Publisher',
        status: 'available'
    },
    {
        id: 125,
        round: 1,
        type: 'mcq',
        content: 'Which of the following types of storage is most suitable for backing up large amounts of business data for long-term archival?',
        options: [ 'Magnetic Tape', 'SSD (Solid State Drive)', 'USB Flash Drive', 'Cache Memory' ],
        answer: 'Magnetic Tape',
        status: 'available'
    },
    {
        id: 126,
        round: 1,
        type: 'mcq',
        content: 'Which of the following business software is primarily used for enterprise resource planning (ERP) to integrate core business processes?',
        options: [ 'SAP', 'Oracle NetSuite', 'Microsoft Dynamics 365', 'Infor' ],
        answer: 'SAP',
        status: 'available'
    },
    {
        id: 127,
        round: 1,
        type: 'mcq',
        content: 'Which of the following is a widely used barcode scanning system in retail and inventory management?',
        options: [ 'QR Code', 'UPC (Universal Product Code)', 'EAN (European Article Number)', 'ISBN (International Standard Book Number)' ],
        answer: 'UPC (Universal Product Code)',
        status: 'available'
    },
    {
        id: 128,
        round: 1,
        type: 'mcq',
        content: 'What is the defining characteristic of "Open Source" software?',
        options: [ 'It is always provided free of charge.', 'It is only developed by community volunteers.', 'Its source code is publicly available for modification and redistribution.', 'It is incompatible with proprietary operating systems like Windows.' ],
        answer: 'Its source code is publicly available for modification and redistribution.',
        status: 'available'
    },
    {
        id: 129,
        round: 1,
        type: 'mcq',
        content: "In computer hardware, what does the CPU's clock speed (measured in GHz) primarily indicate?",
        options: [ 'The number of cores the processor has.', 'The number of processing cycles it performs per second.', 'The amount of data it can transfer simultaneously.', 'The size of its internal cache memory.' ],
        answer: 'The number of processing cycles it performs per second.',
        status: 'available'
    },
    {
        id: 130,
        round: 1,
        type: 'mcq',
        content: 'What is the primary function of cache memory in a computer?',
        options: [ 'To permanently store the operating system and user files.', 'To act as a virtual memory extension when the main RAM is full.', "To store the computer's startup instructions, like the BIOS.", 'To provide the CPU with extremely fast, temporary access to frequently used data.' ],
        answer: 'To provide the CPU with extremely fast, temporary access to frequently used data.',
        status: 'available'
    }
];

// Round 2: Brand Busters Arena - Logo Recognition
const round2Logos: {name: string, file: string}[] = [
    { name: 'Accenture', file: 'accenture.jpg' },
    { name: 'Adobe', file: 'Adobe.jpg' },
    { name: 'AT&T', file: 'AT&T.jpg' },
    { name: 'Atlassian', file: 'Atlassian.png' },
    { name: 'CircleCI', file: 'CircleCI.jpg' },
    { name: 'Cisco', file: 'Cisco.jpg' },
    { name: 'Cognizant', file: 'congnizant.jpg' },
    { name: 'Databricks', file: 'Databrics.jpg' },
    { name: 'Docker', file: 'Docker.jpg' },
    { name: 'Dropbox', file: 'DropBox.jpg' },
    { name: 'Figma', file: 'Figma.jpg' },
    { name: 'Firebase', file: 'FireBase.jpg' },
    { name: 'Fitbit', file: 'FitBit.jpg' },
    { name: 'GitLab', file: 'GitLab.jpg' },
    { name: 'Hexaware', file: 'Hexaware.jpg' },
    { name: 'Jenkins', file: 'JENKINS.jpg' },
    { name: 'Larsen and Toubro', file: 'Larsen and Turbo.jpg' },
    { name: 'Linux', file: 'Linux.jpg' },
    { name: 'Nvidia', file: 'Nvidia.jpg' },
    { name: 'Oracle', file: 'Oracle.jpeg' },
    { name: 'Paypal', file: 'Paypal.jpg' },
    { name: 'Postman', file: 'Postman.jpg' },
    { name: 'Reddit', file: 'reddit.jpg' },
    { name: 'Sentry', file: 'Sentry.jpg' },
    { name: 'SpaceX', file: 'SpaceX.jpg' },
    { name: 'TensorFlow', file: 'tensorflow.jpg' },
    { name: 'Uber', file: 'Uber.jpg' },
    { name: 'Visual Studio', file: 'Visual Studio.jpg' },
    { name: 'Wikipedia', file: 'Wikipedia.jpg' },
    { name: 'WordPress', file: 'wordpress.jpg' }
];
const round2Questions: Question[] = round2Logos.map((logo, index): Question => ({
    id: 201 + index,
    round: 2,
    type: 'logo',
    content: `/quiz/logos/${logo.file}`,
    answer: logo.name,
    status: 'available'
}));

// Round 3: Acronym Assassins
const round3Questions: Question[] = [
    { id: 301, round: 3, type: 'mcq', content: 'In software development, what does the acronym API stand for?', options: ['Automated Protocol Integration', 'Application Programming Interface', 'Application Process Interchange', 'Authenticated Program Interaction'], answer: 'Application Programming Interface', status: 'available' },
    { id: 302, round: 3, type: 'mcq', content: 'What does GUI stand for?', options: ['General Utility Interface', 'Graphical User Interface', 'Global User Integration', 'Gateway User Interaction'], answer: 'Graphical User Interface', status: 'available' },
    { id: 303, round: 3, type: 'mcq', content: 'In the TCP/IP networking model, what does TCP stand for?', options: ['Transfer Control Protocol', 'Transport Connection Protocol', 'Terminal Communication Protocol', 'Transmission Control Protocol'], answer: 'Transmission Control Protocol', status: 'available' },
    { id: 304, round: 3, type: 'mcq', content: 'In networking, what does DNS stand for?', options: ['Dynamic Network System', 'Domain Name System', 'Digital Naming Service', 'Data Naming Standard'], answer: 'Domain Name System', status: 'available' },
    { id: 305, round: 3, type: 'mcq', content: 'What is the full, unabbreviated term for the security mechanism known as CAPTCHA?', options: ['Computerized Authentication Protocol to Challenge Human Applicants', 'Cognitive Assessment Procedure for Tracking Human Analytics', 'Completely Automated Public Turing test to tell Computers and Humans Apart', 'Capture and Process Test for Computer-Human Authentication'], answer: 'Completely Automated Public Turing test to tell Computers and Humans Apart', status: 'available' },
    { id: 306, round: 3, type: 'mcq', content: 'In networking and security, what does VPN stand for?', options: ['Verified Private Network', 'Virtual Protocol for Networks', 'Volumetric Packet Network', 'Virtual Private Network'], answer: 'Virtual Private Network', status: 'available' },
    { id: 307, round: 3, type: 'mcq', content: 'What does the broader term URI stand for?', options: ['Universal Record Identifier', 'Uniform Resource Interpreter', 'Uniform Resource Identifier', 'Universal Resource Index'], answer: 'Uniform Resource Identifier', status: 'available' },
    { id: 308, round: 3, type: 'mcq', content: 'In semiconductor technology, what does LSI stand for?', options: ['Layered Silicon Integration', 'Low Scale Interface', 'Large-Scale Integration', 'Logical System Interconnect'], answer: 'Large-Scale Integration', status: 'available' },
    { id: 309, round: 3, type: 'mcq', content: 'In computer hardware, what does SSD stand for?', options: ['System Storage Disk', 'Secure State Drive', 'Solid-State Drive', 'Synchronous Storage Device'], answer: 'Solid-State Drive', status: 'available' },
    { id: 310, round: 3, type: 'mcq', content: 'What does the government acronym UIDAI stand for?', options: ['Universal Indian Digital Authentication Initiative', 'Unified Indian Database for Aadhaar Integration', 'Unique Identification Authority of India', 'Urban and aadhar a national identity'], answer: 'Unique Identification Authority of India', status: 'available' },
    { id: 311, round: 3, type: 'mcq', content: 'What does PDF stand for?', options: ['Printable Document Format', 'Portable Document Format', 'Packaged Data File', 'Professional Document File'], answer: 'Portable Document Format', status: 'available' },
    { id: 312, round: 3, type: 'mcq', content: 'In programming, what does IDE stand for?', options: ['Interactive Development Engine', 'Interface Design Environment', 'Integrated Development Environment', 'Internal Debugging Engine'], answer: 'Integrated Development Environment', status: 'available' },
    { id: 313, round: 3, type: 'mcq', content: 'In wireless networking, what is WiFi commonly understood to stand for?', options: ['Wireless Firewall', 'Wireless File-sharing', 'Wired Fidelity', 'Wireless Fidelity'], answer: 'Wireless Fidelity', status: 'available' },
    { id: 314, round: 3, type: 'mcq', content: 'In the context of security and authentication, what does PIN stand for?', options: ['Private Information Network', 'Personal Index Number', 'Primary Identification Node', 'Personal Identification Number'], answer: 'Personal Identification Number', status: 'available' },
    { id: 315, round: 3, type: 'mcq', content: 'In the context of Indian financial identification, what does PAN stand for?', options: ['Personal Account Number', 'Primary All-India Number', 'Personal Authentication Number', 'Permanent Account Number'], answer: 'Permanent Account Number', status: 'available' },
    { id: 316, round: 3, type: 'mcq', content: 'What does AMD stand for?', options: ['Applied Micro Devices', 'Advanced Machine Development', 'Advanced Micro Devices', 'Automated Media Design'], answer: 'Advanced Micro Devices', status: 'available' },
    { id: 317, round: 3, type: 'mcq', content: 'In web development and data transfer, what does FTP stand for?', options: ['Folder Transfer Process', 'Fast Transmission Protocol', 'File Transfer Protocol', 'Formatted Text Protocol'], answer: 'File Transfer Protocol', status: 'available' },
    { id: 318, round: 3, type: 'mcq', content: 'What does ERP stand for in business software?', options: ['Enterprise Reporting Platform', 'Electronic Resource Protocol', 'External Risk Prevention', 'Enterprise Resource Planning'], answer: 'Enterprise Resource Planning', status: 'available' },
    { id: 319, round: 3, type: 'mcq', content: 'In display technology, what does OLED stand for?', options: ['Optical Light Emitting Display', 'Organic Laser Emitting Diode', 'Optoelectronic Light Emitting Device', 'Organic Light Emitting Diode'], answer: 'Organic Light Emitting Diode', status: 'available' },
    { id: 320, round: 3, type: 'mcq', content: 'In the field of design, what do the acronyms UI and UX stand for?', options: ['User Interaction and User Engagement', 'Unified Interface and Universal Experience', 'Usability Index and User Exploration', 'User Interface and User Experience'], answer: 'User Interface and User Experience', status: 'available' },
    { id: 321, round: 3, type: 'mcq', content: 'In the context of Indian banking, what does IFSC stand for?', options: ['Indian Foreign Service Code', 'International Financial Standard Code', 'Indian Financial System Code', 'Indian Fund and Securities Code'], answer: 'Indian Financial System Code', status: 'available' },
    { id: 322, round: 3, type: 'mcq', content: 'In terms of digital storage units, what does YB stand for?', options: ['Yobibyte', 'Yottabit', 'Yoctobyte', 'Yottabyte'], answer: 'Yottabyte', status: 'available' },
    { id: 323, round: 3, type: 'mcq', content: 'What does the image file format PNG stand for?', options: ['Photo Network Graphics', 'Pixel-Native Graphics', 'Portable Network Graphics', 'Printable Neutral Graphics'], answer: 'Portable Network Graphics', status: 'available' },
    { id: 324, round: 3, type: 'mcq', content: 'In the context of the Internet of Things, what does IoT stand for?', options: ['Input/Output Technology', 'Integrated Online Technology', 'Internet of Things', 'Interconnected Object Topology'], answer: 'Internet of Things', status: 'available' },
    { id: 325, round: 3, type: 'mcq', content: 'What does the acronym "CAD" stand for in the context of technology and design?', options: ['Centralized Application Design', 'Computer-Aided Design', 'Complex Algorithm Development', 'Controlled Automated Drawing'], answer: 'Computer-Aided Design', status: 'available' },
    { id: 326, round: 3, type: 'mcq', content: 'In data capture technology, what does OMR stand for?', options: ['Optical Mark Reading', 'Opto-Mechanical Reader', 'Optical Mark Reader', 'Optical Mark Recognition'], answer: 'Optical Mark Recognition', status: 'available' },
    { id: 327, round: 3, type: 'mcq', content: 'What does the acronym CLI stand for?', options: ['Command Line Interface', 'Common Language Infrastructure', 'Complex Language Interpreter', 'Command Language Input'], answer: 'Command Line Interface', status: 'available' },
    { id: 328, round: 3, type: 'mcq', content: 'In software engineering, what does ASCII stand for?', options: ['American Standard Code for Information Interchange', 'Automated Standard Code for International Integration', 'Advanced System for Character and Integer Interpretation', 'American Standard Computer Interlink Index'], answer: 'American Standard Code for Information Interchange', status: 'available' },
    { id: 329, round: 3, type: 'mcq', content: 'In networking, what does DHCP stand for?', options: ['Dynamic Host Configuration Protocol', 'Digital Host Communication Protocol', 'Dynamic Host Control Protocol', 'Distributed Host Configuration Protocol'], answer: 'Dynamic Host Configuration Protocol', status: 'available' },
    { id: 330, round: 3, type: 'mcq', content: 'In web infrastructure, what does CDN stand for?', options: ['Content Delivery Network', 'Complex Domain Name', 'Content Distribution Network', 'Centralized Data Node'], answer: 'Content Delivery Network', status: 'available' }
];

// Round 4: Cyber Security
const round4Questions: Question[] = [
    {
        id: 401,
        round: 4,
        type: 'mcq',
        content: 'Which of the following best describes a "Zero-Day" vulnerability?',
        options: [
            "A security flaw found during the first day of a software's release.",
            'A type of malware that activates at midnight.',
            'A vulnerability that has been patched within 24 hours.',
            'A software flaw that is discovered by attackers before the vendor is aware of it.'
        ],
        answer: 'A software flaw that is discovered by attackers before the vendor is aware of it.',
        status: 'available'
    },
    {
        id: 402,
        round: 4,
        type: 'mcq',
        content: 'In the context of network security, what is the primary function of a firewall?',
        options: [
            'To encrypt all incoming and outgoing network traffic.',
            'To monitor and control incoming and outgoing network traffic based on predetermined security rules.',
            'To detect and remove malware from network packets.',
            'To authenticate users before they can access the network.'
        ],
        answer: 'To monitor and control incoming and outgoing network traffic based on predetermined security rules.',
        status: 'available'
    },
    {
        id: 403,
        round: 4,
        type: 'mcq',
        content: 'What is a key difference between symmetric and asymmetric cryptography?',
        options: [
            'Symmetric encryption is older and no longer used in modern systems.',
            'Asymmetric encryption is significantly faster than symmetric encryption for large amounts of data.',
            'Symmetric encryption uses a single key for both encryption and decryption, while asymmetric uses a public and a private key.',
            'Asymmetric encryption is primarily used for hashing, while symmetric encryption is used for data transmission.'
        ],
        answer: 'Symmetric encryption uses a single key for both encryption and decryption, while asymmetric uses a public and a private key.',
        status: 'available'
    },
    {
        id: 404,
        round: 4,
        type: 'mcq',
        content: 'Which of the following describes a Distributed Denial-of-Service (DDoS) attack?',
        options: [
            'A single computer sending a flood of requests to a target server to overwhelm it.',
            "An attack that targets a specific individual's computer to steal personal information.",
            'A coordinated attack from multiple compromised devices (a botnet) to overwhelm a target with traffic.',
            'An attack that intercepts and alters communication between two systems.'
        ],
        answer: 'A coordinated attack from multiple compromised devices (a botnet) to overwhelm a target with traffic.',
        status: 'available'
    },
    {
        id: 405,
        round: 4,
        type: 'mcq',
        content: 'Which of the following is a common technique used in social engineering?',
        options: [ 'Brute-force attack', 'Phishing', 'Port scanning', 'Man-in-the-middle attack' ],
        answer: 'Phishing',
        status: 'available'
    },
    {
        id: 406,
        round: 4,
        type: 'mcq',
        content: 'Which type of malware is specifically designed to replicate itself and spread to other computers over a network, often without any human interaction?',
        options: [ 'Trojan Horse', 'Worm', 'Spyware', 'Ransomware' ],
        answer: 'Worm',
        status: 'available'
    },
    {
        id: 407,
        round: 4,
        type: 'mcq',
        content: 'What is the primary principle behind Multi-Factor Authentication (MFA)?',
        options: [
            'Using a single, very complex password to secure an account.',
            'Requiring the user to provide two or more different types of verification to prove their identity.',
            'Changing your password every 30 days for enhanced security.',
            'Encrypting login credentials before they are sent over the network.'
        ],
        answer: 'Requiring the user to provide two or more different types of verification to prove their identity.',
        status: 'available'
    },
    {
        id: 408,
        round: 4,
        type: 'mcq',
        content: 'What is the main purpose of a Honeypot in a network?',
        options: [
            'To encrypt sensitive data and protect it from unauthorized access.',
            'To act as a decoy to attract and trap potential attackers, allowing security teams to study their methods.',
            'To store and manage user passwords securely.',
            'To back up critical data in case of a ransomware attack.'
        ],
        answer: 'To act as a decoy to attract and trap potential attackers, allowing security teams to study their methods.',
        status: 'available'
    },
    {
        id: 409,
        round: 4,
        type: 'mcq',
        content: 'What is the primary purpose of using a Virtual Private Network (VPN)?',
        options: [
            'To make your internet connection faster.',
            'To block all advertisements from websites.',
            'To create a secure and encrypted connection over a public network.',
            'To scan your computer for viruses.'
        ],
        answer: 'To create a secure and encrypted connection over a public network.',
        status: 'available'
    },
    {
        id: 410,
        round: 4,
        type: 'mcq',
        content: 'Which of the following best describes "malware"?',
        options: [
            'A piece of hardware that is not working correctly.',
            'A general term for any software designed to cause harm to a computer, server, or network.',
            'A weak password that is easy to guess.',
            'An outdated software application that needs to be updated.'
        ],
        answer: 'A general term for any software designed to cause harm to a computer, server, or network.',
        status: 'available'
    },
    {
        id: 411,
        round: 4,
        type: 'mcq',
        content: 'What is the main difference between a virus and a Trojan horse?',
        options: [
            'A virus is a type of hardware, while a Trojan is a type of software.',
            'A virus self-replicates and attaches to other programs, while a Trojan disguises itself as legitimate software to trick users into installing it.',
            'A Trojan is designed to steal data, while a virus is designed to crash a computer.',
            'Viruses are only found on Windows computers, while Trojans can infect any operating system.'
        ],
        answer: 'A virus self-replicates and attaches to other programs, while a Trojan disguises itself as legitimate software to trick users into installing it.',
        status: 'available'
    },
    {
        id: 412,
        round: 4,
        type: 'mcq',
        content: 'Why is it important to regularly install software updates and security patches?',
        options: [
            'To get new visual features and icons for the application.',
            'To fix known security vulnerabilities that could be exploited by attackers.',
            'To increase the overall speed and performance of the computer.',
            'To free up storage space on the hard drive.'
        ],
        answer: 'To fix known security vulnerabilities that could be exploited by attackers.',
        status: 'available'
    },
    {
        id: 413,
        round: 4,
        type: 'mcq',
        content: 'In cybersecurity, what does "CIA" stand for in the context of the CIA Triad?',
        options: [ 'Central Intelligence Agency', 'Confidentiality, Integrity, and Availability', 'Certified Internet Assessor', 'Control, Information, and Access' ],
        answer: 'Confidentiality, Integrity, and Availability',
        status: 'available'
    },
    {
        id: 414,
        round: 4,
        type: 'mcq',
        content: 'What is the primary characteristic of a ransomware attack?',
        options: [
            'It secretly records user keystrokes to steal passwords.',
            'It overwhelms a website with traffic, making it unavailable.',
            "It encrypts a victim's files and demands a payment to restore access.",
            'It tricks users into installing it by pretending to be a legitimate application.'
        ],
        answer: "It encrypts a victim's files and demands a payment to restore access.",
        status: 'available'
    },
    {
        id: 415,
        round: 4,
        type: 'mcq',
        content: 'What is the role of an Intrusion Detection System (IDS)?',
        options: [
            'To prevent all unauthorized access to a network by blocking suspicious traffic.',
            'To monitor network or system activities for malicious activities or policy violations and to report them.',
            'To encrypt all data on a hard drive to prevent theft.',
            'To create decoy systems to trap and study attackers.'
        ],
        answer: 'To monitor network or system activities for malicious activities or policy violations and to report them.',
        status: 'available'
    },
    {
        id: 416,
        round: 4,
        type: 'mcq',
        content: 'What is a "Man-in-the-Middle" (MitM) attack?',
        options: [
            'An attack where a cybercriminal physically breaks into a server room to steal data.',
            'A type of malware that remains dormant until a specific date or time.',
            'An attack where the attacker secretly intercepts and relays communication between two parties who believe they are directly communicating with each other.',
            "A social engineering tactic where the attacker pretends to be a manager to get an employee's password."
        ],
        answer: 'An attack where the attacker secretly intercepts and relays communication between two parties who believe they are directly communicating with each other.',
        status: 'available'
    },
    {
        id: 417,
        round: 4,
        type: 'mcq',
        content: 'Which of the following describes a brute-force attack?',
        options: [
            'An attack that tricks a user into clicking a malicious link.',
            'An attempt to guess a password by systematically trying every possible combination of letters, numbers, and symbols.',
            'An attack that exploits a specific software vulnerability.',
            'An attack that involves listening to network traffic to capture unencrypted data.'
        ],
        answer: 'An attempt to guess a password by systematically trying every possible combination of letters, numbers, and symbols.',
        status: 'available'
    },
    {
        id: 418,
        round: 4,
        type: 'mcq',
        content: 'What is the purpose of hashing a password before storing it in a database?',
        options: [
            'To make the password shorter and save storage space.',
            'To convert the password into an irreversible, fixed-length string to prevent it from being read, even if the database is compromised.',
            'To encrypt the password so that it can be decrypted and viewed by administrators if needed.',
            'To check for spelling errors in the password.'
        ],
        answer: 'To convert the password into an irreversible, fixed-length string to prevent it from being read, even if the database is compromised.',
        status: 'available'
    },
    {
        id: 419,
        round: 4,
        type: 'mcq',
        content: 'What does the term "sandboxing" refer to in cybersecurity?',
        options: [
            'A physical, isolated computer used for testing malware.',
            'A security mechanism for separating running programs, usually to execute untested or untrusted code without risking harm to the host machine.',
            'A method for encrypting data in a secure container.',
            'A type of firewall that filters traffic based on its content.'
        ],
        answer: 'A security mechanism for separating running programs, usually to execute untested or untrusted code without risking harm to the host machine.',
        status: 'available'
    },
    {
        id: 420,
        round: 4,
        type: 'mcq',
        content: 'Which security concept ensures that a user is who they claim to be?',
        options: [ 'Authorization', 'Authentication', 'Accounting', 'Auditing' ],
        answer: 'Authentication',
        status: 'available'
    },
    {
        id: 421,
        round: 4,
        type: 'mcq',
        content: 'What is the primary function of a Security Information and Event Management (SIEM) system?',
        options: [
            'To automatically install security patches on all company computers.',
            'To provide a central place for collecting, analyzing, and generating reports on security-related data from various sources.',
            'To manage and reset user passwords across the entire organization.',
            'To conduct penetration testing and identify network vulnerabilities.'
        ],
        answer: 'To provide a central place for collecting, analyzing, and generating reports on security-related data from various sources.',
        status: 'available'
    },
    {
        id: 422,
        round: 4,
        type: 'mcq',
        content: 'What is "spear phishing"?',
        options: [
            'A phishing attack that is sent to a very large, general audience.',
            'A phishing attempt that uses text messages instead of email.',
            'A highly targeted phishing attack aimed at a specific individual or organization, often using personalized information to appear more legitimate.',
            'A type of phishing that directs users to a fake website that looks identical to a real one.'
        ],
        answer: 'A highly targeted phishing attack aimed at a specific individual or organization, often using personalized information to appear more legitimate.',
        status: 'available'
    },
    {
        id: 423,
        round: 4,
        type: 'mcq',
        content: 'What is the main purpose of "salting" a password before hashing it?',
        options: [
            'To make the password longer and harder to guess.',
            'To add extra, random data to each password before it is hashed, making it much harder to crack using pre-computed "rainbow tables."',
            'To encrypt the password with an additional key for extra security.',
            'To automatically delete the password from the database after a certain period of time.'
        ],
        answer: 'To add extra, random data to each password before it is hashed, making it much harder to crack using pre-computed "rainbow tables."',
        status: 'available'
    },
    {
        id: 424,
        round: 4,
        type: 'mcq',
        content: 'Which of the following is an example of "tailgating"?',
        options: [
            'Following an authorized person through a secure door or entry point without providing your own credentials.',
            "Hacking into a car's computer system to control its functions remotely.",
            'Using a very long and complex password that is hard to remember.',
            'An attack that is carried out over a very long period to avoid detection.'
        ],
        answer: 'Following an authorized person through a secure door or entry point without providing your own credentials.',
        status: 'available'
    },
    {
        id: 425,
        round: 4,
        type: 'mcq',
        content: 'What is the main goal of a penetration test (pen test)?',
        options: [
            'To install security software on all company computers.',
            'To simulate a real-world attack on a system, network, or application to identify and fix security vulnerabilities.',
            'To train employees on how to recognize phishing emails.',
            'To back up all critical company data in a secure, off-site location.'
        ],
        answer: 'To simulate a real-world attack on a system, network, or application to identify and fix security vulnerabilities.',
        status: 'available'
    },
    {
        id: 426,
        round: 4,
        type: 'mcq',
        content: 'In the context of Wi-Fi security, which of the following is the most secure encryption protocol?',
        options: [ 'WEP (Wired Equivalent Privacy)', 'WPA (Wi-Fi Protected Access)', 'WPA2 (Wi-Fi Protected Access 2)', 'WPS (Wi-Fi Protected Setup)' ],
        answer: 'WPA2 (Wi-Fi Protected Access 2)',
        status: 'available'
    },
    {
        id: 427,
        round: 4,
        type: 'mcq',
        content: 'What is the purpose of a "CAPTCHA"?',
        options: [
            'To track user activity on a website for marketing purposes.',
            'To distinguish between human users and automated bots.',
            'To encrypt the data sent between a user and a website.',
            'To scan for viruses in files before they are downloaded.'
        ],
        answer: 'To distinguish between human users and automated bots.',
        status: 'available'
    },
    {
        id: 428,
        round: 4,
        type: 'mcq',
        content: 'What is a "Botnet"?',
        options: [
            'A security policy for employees who work remotely.',
            "A network of private computers infected with malicious software and controlled as a group without the owners' knowledge.",
            'A type of antivirus software that specializes in detecting bots.',
            'A secure, encrypted network used for anonymous communication.'
        ],
        answer: "A network of private computers infected with malicious software and controlled as a group without the owners' knowledge.",
        status: 'available'
    },
    {
        id: 429,
        round: 4,
        type: 'mcq',
        content: 'What does "HTTPS" at the beginning of a URL indicate?',
        options: [
            'The website is a high-traffic site.',
            'The connection to the website is encrypted, making it more secure than a standard HTTP connection.',
            'The website has been officially approved by the government.',
            'The website is hosted on a high-speed server.'
        ],
        answer: 'The connection to the website is encrypted, making it more secure than a standard HTTP connection.',
        status: 'available'
    },
    {
        id: 430,
        round: 4,
        type: 'mcq',
        content: 'What is a "Data Breach"?',
        options: [
            'The process of backing up data to a secure location.',
            "An incident where information is stolen or taken from a system without the knowledge or authorization of the system's owner.",
            'A software update that fixes security holes.',
            'A physical security measure to protect a data center.'
        ],
        answer: "An incident where information is stolen or taken from a system without the knowledge or authorization of the system's owner.",
        status: 'available'
    }
];

export const manualTieBreakerQuestions: Question[] = [
    { id: 911, round: 1, type: 'mcq', content: 'Which of the following storage types provides the fastest data access speed?', options: ['SSD (Solid State Drive)', 'Virtual Memory', 'Cache Memory', 'RAM'], answer: 'Cache Memory', status: 'available' },
    { id: 912, round: 1, type: 'mcq', content: 'Which of the following is considered a relational database management system (RDBMS)?', options: ['MongoDB', 'Oracle Database', 'Redis', 'Neo4j'], answer: 'Oracle Database', status: 'available' },
    { id: 913, round: 1, type: 'mcq', content: 'Which of the following protocols is primarily used for secure communication between a web browser and a server?', options: ['FTP', 'HTTPS', 'SMTP', 'SSH'], answer: 'HTTPS', status: 'available' },
    { id: 914, round: 1, type: 'mcq', content: 'Which of the following is NOT an example of system software?', options: ['Compiler', 'Operating System', 'Device Driver', 'MS PowerPoint'], answer: 'MS PowerPoint', status: 'available' },
    { id: 915, round: 1, type: 'mcq', content: 'Which of the following types of malware spreads without needing to attach itself to an existing program?', options: ['Trojan Horse', 'Worm', 'Virus', 'Spyware'], answer: 'Worm', status: 'available' },
    { id: 916, round: 1, type: 'mcq', content: 'Which of the following file systems is most commonly used in Windows operating systems for handling large files and modern drives?', options: ['FAT32', 'exFAT', 'NTFS', 'EXT4'], answer: 'NTFS', status: 'available' },
    { id: 917, round: 1, type: 'mcq', content: 'Which of the following cloud service models provides users with the ability to deploy and run their own applications without managing the underlying hardware?', options: ['IaaS (Infrastructure as a Service)', 'SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'DaaS (Data as a Service)'], answer: 'PaaS (Platform as a Service)', status: 'available' },
    { id: 918, round: 1, type: 'mcq', content: 'Which of the following best describes the function of DNS (Domain Name System)?', options: ['Encrypting website traffic for security', 'Translating domain names into IP addresses', 'Blocking unauthorized network traffic', 'Distributing internet bandwidth equally'], answer: 'Translating domain names into IP addresses', status: 'available' },
    { id: 919, round: 1, type: 'mcq', content: 'Which of the following memory types is both volatile and directly accessible by the CPU for processing?', options: ['ROM', 'Cache', 'RAM', 'Flash Memory'], answer: 'RAM', status: 'available' },
    { id: 920, round: 1, type: 'mcq', content: 'Which of the following best explains the difference between open-source and proprietary software?', options: ['Open-source software is always free, while proprietary software is always paid.', 'Open-source software has publicly available source code, while proprietary software does not.', 'Open-source software cannot be used in businesses, while proprietary software can.', 'Open-source software works only on Linux, while proprietary software works on all platforms.'], answer: 'Open-source software has publicly available source code, while proprietary software does not.', status: 'available' }
];

export const allQuestions: Question[] = [
  ...round1Questions,
  ...round2Questions,
  ...round3Questions,
  ...round4Questions,
];

export const roundDetails: RoundDetails = {
    1: {
        title: 'Tech Titans Challenge',
        teamsAdvancing: 8,
        rules: `Format:
- Teams: 10 teams start, 8 advance.
- Questions: 30 questions available.
- Timer: 30 seconds per question.

Scoring:
- Direct Correct Answer: +10 points
- Passed Correct Answer: +5 points
- Wrong/No Answer: 0 points.

Elimination:
- The bottom 2 teams with the lowest scores are eliminated. Ties are resolved with a Sudden Death tie-breaker.`
    },
    2: {
        title: 'Brand Busters Arena',
        teamsAdvancing: 6,
        rules: `Format:
- Teams: 8 teams compete, 6 advance.
- Questions: Logo identification.
- Timer: 30 seconds per logo.

Scoring:
- Direct Correct Answer: +10 points
- Passed Correct Answer: +5 points
- Wrong/No Answer: 0 points.

Elimination:
- The bottom 2 teams with the lowest cumulative scores are eliminated. Ties are resolved with a Sudden Death tie-breaker.`
    },
    3: {
        title: 'Acronym Assassins',
        teamsAdvancing: 3,
        rules: `Format:
- Teams: 6 teams compete, 3 advance.
- Questions: Tech & CS acronyms.
- Timer: 30 seconds per question.

Scoring:
- Direct Correct Answer: +10 points
- Passed Correct Answer: +5 points
- Wrong/No Answer: 0 points.

Elimination:
- The bottom 3 teams with the lowest cumulative scores are eliminated. Ties are resolved with a Sudden Death tie-breaker.`
    },
    4: {
        title: 'Cyber Security',
        teamsAdvancing: 1,
        rules: `Format:
- Teams: The 3 finalists compete.
- Questions: Cybersecurity concepts.
- Timer: 60 seconds per question.

Scoring:
- Direct Correct Answer: +10 points
- No Passing: Passing is disabled.

Winner:
- The team with the highest total score is crowned the champion. Ties for first place are resolved manually.`
    }
};

// This is legacy and will be removed
export const tieBreakerQuestions: Question[] = [
    { id: 901, round: 5, type: 'mcq', content: 'What is the decimal equivalent of the binary number 1011?', options: ['9', '10', '11', '12'], answer: '11', status: 'available' },
    { id: 902, round: 5, type: 'mcq', content: 'What does the acronym "SaaS" stand for?', options: ['Software as a Service', 'System as a Service', 'Security as a Service', 'Software as a System'], answer: 'Software as a Service', status: 'available' },
    { id: 903, round: 5, type: 'mcq', content: 'In object-oriented programming, what is the term for creating a new class from an existing class?', options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'], answer: 'Inheritance', status: 'available' },
    { id: 904, round: 5, type: 'mcq', content: 'Which HTTP status code means "Not Found"?', options: ['200', '301', '404', '500'], answer: '404', status: 'available' },
    { id: 905, round: 5, type: 'mcq', content: 'What is the default port for HTTPS?', options: ['80', '8080', '21', '443'], answer: '443', status: 'available' },
    { id: 906, round: 5, type: 'mcq', content: 'In CSS, which property is used to change the text color of an element?', options: ['text-color', 'font-color', 'color', 'text-style'], answer: 'color', status: 'available' },
    { id: 907, round: 5, type: 'mcq', content: 'What data structure uses a Last-In, First-Out (LIFO) method?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], answer: 'Stack', status: 'available' },
    { id: 908, round: 5, type: 'mcq', content: 'Which company developed the Python programming language?', options: ['Google', 'Microsoft', 'Dropbox', 'Not a company'], answer: 'Not a company', status: 'available' },
    { id: 909, round: 5, type: 'mcq', content: 'What is the full form of JSON?', options: ['Java Standard Object Notation', 'JavaScript Object Notation', 'Java Source Object Notation', 'JavaScript Oriented Notation'], answer: 'JavaScript Object Notation', status: 'available' },
    { id: 910, round: 5, type: 'mcq', content: 'Which version control system was created by Linus Torvalds?', options: ['SVN', 'Mercurial', 'Git', 'CVS'], answer: 'Git', status: 'available' }
];
