"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClientSchema = exports.createClientSchema = exports.clientSchema = void 0;
const zod_1 = require("zod");
exports.clientSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z
        .string()
        .min(3, { message: "Name must be at least 3 characters long." }),
    salary: zod_1.z.number().positive({ message: "Salary must be a positive number." }),
    companyValue: zod_1.z
        .number()
        .positive({ message: "Company value must be a positive number." }),
    createdAt: zod_1.z
        .string()
        .datetime({ message: "Invalid createdAt datetime string format." }),
    updatedAt: zod_1.z
        .string()
        .datetime({ message: "Invalid updatedAt datetime string format." }),
});
exports.createClientSchema = exports.clientSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.updateClientSchema = exports.createClientSchema.partial();
//# sourceMappingURL=index.js.map