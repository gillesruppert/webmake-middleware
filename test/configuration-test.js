"use strict";

const expect = require("expect.js");
const webmakeMw = require("../");

describe("webmake middleware", () => {
	describe("configuration function", () => {
		it("should be a function which takes to arguments", () => {
			expect(webmakeMw).to.be.a("function");
			expect(webmakeMw).to.have.length(1);
		});

		it("should return a middelware function which takes 3 arguments", () => {
			expect(webmakeMw({})).to.be.a("function");
			expect(webmakeMw({})).to.have.length(3);
		});

		it("should take 1 object as argument", () => {
			function err1() { webmakeMw(); }
			expect(err1).to.throwError();
			expect(webmakeMw({})).to.be.a("function");
		});
	});
});
