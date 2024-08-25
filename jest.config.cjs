// jest.config.cjs
module.exports = {
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    testEnvironment: "node",
    transformIgnorePatterns: ["/node_modules/(?!(chai)/)"],
};
