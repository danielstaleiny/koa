const fetchData = () => {
    return new Promise((resolve, reject) => resolve("success"));
};

test("the test", async () => {
    const data = await fetchData();
    expect(data).toBe("success");
});
