const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { searchCareerQuickly } = require('../src/services/searchService');

(async () => {
    console.log("=== Testing Search Section (Bách khoa - CNTT) ===");
    try {
        const input = {
            mode: 'HOC',
<<<<<<< HEAD
            industry: 'nhạc sĩ',
            location: 'Đà Nẵng',
=======
            school: 'Trường Đại học Bách khoa - ĐHQG TP.HCM',
            industry: 'công nghệ thông tin',
>>>>>>> 9617ffad3143e8a5877c65a94bb509907c4c614a
            age: 18
        };
        console.log("Input data:", JSON.stringify(input, null, 2));
        console.log("Calling searchCareerQuickly...\n");
        
        const result = await searchCareerQuickly(input);
        
        console.log("=== Result ===");
        console.log(JSON.stringify(result, null, 2));
        console.log("\n=== Test Completed successfully ===");
    } catch (error) {
        console.error("Test failed with error:", error);
    }
})();
