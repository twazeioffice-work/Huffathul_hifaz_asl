export async function fetchAcademicsData(instCode: string, brCode: string, token: string) {
    // Mocking response for now since Backend is not running
    return {
        courses: [
            {
                id: "11111111-1111-1111-1111-111111111111",
                code: "HIFZ-PREP",
                name: "Hifz Preparation Program",
                duration_months: 12,
                grading_system: "Percentage"
            },
            {
                id: "22222222-2222-2222-2222-222222222222",
                code: "ALIM-YEAR1",
                name: "Alim Course First Year",
                duration_months: 12,
                grading_system: "GPA"
            }
        ]
    };
}
