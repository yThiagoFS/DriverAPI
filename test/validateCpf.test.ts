import { validate } from "../src/domain/validateCpf";

test.each([
    "01234567890",
    "71428793860",
    "87748248800"
])("Deve testar um CPF válido: %s", function (cpf: any) {
    expect(validate(cpf)).toBe(true);
})

test.each([
    undefined,
    null,
    "11111111111",
    "0123456789010",
    "0123456"
])("Deve testar um CPF inválido: %s", function (cpf: any) {
    expect(validate(cpf)).toBe(false);
})