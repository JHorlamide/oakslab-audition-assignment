import { Request, Response } from "express";
import phaseService from "../services/PhaseService";
import responseHandler from "../../common/responseHandler";

class PhaseController {
  public getAllPhases(req: Request, res: Response) {
    try {
      const phases = phaseService.getAllPhases()
      responseHandler.successResponse("Phases fetched", phases, res);
    } catch (error: any) {
      responseHandler.failureResponse(error.message, res);
    }
  }

  public createNewPhase(req: Request, res: Response) {
    try {
      const newPhase = phaseService.createNewPhase(req.body);
      responseHandler.successfullyCreated("New phase created successfully", newPhase, res);
    } catch (error: any) {
      responseHandler.failureResponse(error.message, res);
    }
  }

  public createNewTask(req: Request, res: Response) {
    try {
      const { phaseId } = req.params;
      const { name, description } = req.body;

      const newPhaseTask = phaseService.createNewTask({ phaseId, name, description });
      responseHandler.successfullyCreated("Task created successfully", newPhaseTask, res);
    } catch (error: any) {
      responseHandler.failureResponse(error.message, res);
    }
  }

  public markTaskCompleted(req: Request, res: Response) {
    try {
      const { phaseId, taskId } = req.params;
      const { completed } = req.body;

      const completeTaskPhase = phaseService.completeTask({ phaseId, taskId, completed });
      responseHandler.successResponse("Task completed successfully", completeTaskPhase, res);
    } catch (error: any) {
      responseHandler.failureResponse(error.message, res);
    }
  }

  public reopenTask(req: Request, res: Response) {
    try {
      const { phaseId, taskId } = req.params;

      const reopenedTask = phaseService.undoTask({ phaseId, taskId });
      responseHandler.successResponse("Task reopened successfully", reopenedTask, res);
    } catch (error: any) {
      responseHandler.failureResponse(error.message, res);
    }
  }
}

export default new PhaseController();
