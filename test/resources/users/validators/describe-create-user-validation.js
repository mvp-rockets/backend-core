const chai = require("chai");
const expect = chai.expect;
const CreateUserValidation = require("resources/users/validators/create-user-validations");
const { verifyResultOk, verifyResultError } = require("helpers/verifiers.js");

describe("create user validations", () => {

  it("should be enter all valid user data", async () => {
    let response = await CreateUserValidation.validate({
      username: "user",
      password: "user1",
    });
    verifyResultOk(() => {
      
    })(response);
  });
  
});
