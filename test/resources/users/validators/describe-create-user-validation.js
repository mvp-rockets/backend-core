const chai = require("chai");
const expect = chai.expect;
const CreateUserValidation = require("resources/users/validators/create-user-validations");
const { verifyResultOk, verifyResultError } = require("helpers/verifiers.js");

describe("create user validations", () => {

  // it("should have mandatory and unique username", async () => {
  //   let response = await CreateUserValidation.validate({});
 
  //   verifyResultError((error) => {
  //     expect(error.errorMessage).to.include("Username is required");
  //   })(response);
  // });

  // it("should be enter password", async () => {
  //   let response = await CreateUserValidation.validate({});
  
  //   verifyResultError((error) => {
  //     expect(error.errorMessage).to.include("Password is required");
  //   })(response);
  // });



  it("should be enter all valid user data", async () => {
    let response = await CreateUserValidation.validate({
      username: "user",
      password: "user1",
    });
    verifyResultOk(() => {
      
    })(response);
  });
  
});
