import { Request, Response, NextFunction } from "express";
import responseHandler from "../../common/responseHandler";
import { phaseSchema, taskSchema, completeTaskSchema } from "../validation/phaseValidationSchema";

class PhaseMiddleware {
  public validateCreatePhaseRequest = this.validateRequestSchema(phaseSchema);

  public validateCreateTaskRequest = this.validateRequestSchema(taskSchema);

  public validateCompleteTaskRequest = this.validateRequestSchema(completeTaskSchema);

  private validateRequestSchema(schema: any) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return responseHandler.failureResponse(error.details[0].message, res);
      }

      next();
    }
  }
}

export default new PhaseMiddleware();
