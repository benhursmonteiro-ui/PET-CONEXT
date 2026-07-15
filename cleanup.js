const fs = require('fs');
const path = './public/app.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Replace state
content = content.replace(/let state = \{[\s\S]*?reelsSearchQuery: ''\n\};/, `let state = {
    theme: 'light',
    mobileChatActive: false,
    tutor: {
        name: 'Usuário',
        location: '',
        bio: '',
        avatar: 'assets/tutor_avatar.png',
        friendsCount: 0,
        followersCount: 0
    },
    pets: [],
    feed: [],
    reels: [],
    stories: [],
    reports: [],
    activeReelIndex: 0,
    friends: [],
    activeChatFriendId: null,
    forum: [],
    activeForumCategory: 'Todos',
    adoptionPets: [],
    adoptionApplications: [],
    activeAdoptionFilter: 'Todos',
    events: [],
    activeTab: 'feed',
    reelsSearchQuery: ''
};`);

// 2. Replace BOT_REPLIES
content = content.replace(/const BOT_REPLIES = \{[\s\S]*?\n\};\n/g, 'const BOT_REPLIES = {};\n');

// 3. Replace PROFILES
content = content.replace(/const PROFILES = \[[\s\S]*?\n\];\n/g, 'const PROFILES = [];\n');

// 4. Replace SPONSORS
content = content.replace(/const SPONSORS = \[[\s\S]*?patrocinado_logo_3\.png'\n    \}\n\];/g, 'const SPONSORS = [];');

// 5. Remove Seed default stories
content = content.replace(/if \(\!state\.stories \|\| state\.stories\.length === 0\) \{[\s\S]*?friendId: 'f-4'\n            \}\n        \];\n    \}/g, '');

// 6. Remove right widgets sidebar content
// Using string instead of template literal to avoid backtick issues in regex
content = content.replace(/<!-- Right Widgets Sidebar -->[\s\S]*?<\/div>\n    <\/div>\n    \`;/g, 
'<!-- Right Widgets Sidebar -->\\n' +
'        <div class="feed-widgets">\\n' +
'        </div>\\n' +
'    </div>\\n' +
'    `;');

fs.writeFileSync(path, content, 'utf8');
console.log('Done cleaning app.js');
