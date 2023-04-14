import { Application } from "express";
import { CommonRoutesConfig } from "../common/commonRouteConfig";
import phaseMiddleware from "./middleware/phaseMiddleware";
import PhaseController from "./controller/PhaseController";

export class PhasesRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "PhasesRoutes");
  }

  configureRoutes() {
    /***
    * @router  GET: /api/phases
    * @desc    Get all created phases
    * @access  Public
    * ***/
    this.app.get("/api/phases", [
      PhaseController.getAllPhases
    ])

    /***
    * @router  POST: /api/phases
    * @desc    Create new phase
    * @access  Public
    * ***/
    this.app.post("/api/phases", [
      phaseMiddleware.validateCreatePhaseRequest,
      PhaseController.createNewPhase
    ])

    /***
    * @router  POST: /api/phases/:phaseId/tasks
    * @desc    Create new task for a phase
    * @access  Public
    * ***/
    this.app.post("/api/phases/:phaseId/tasks", [
      phaseMiddleware.validateCreateTaskRequest,
      PhaseController.createNewTask
    ])

    /***
    * @router  PUT: /api/phases/:phaseId/tasks/:taskId
    * @desc    Mark a task as completed
    * @access  Public
    * ***/
    this.app.put("/api/phases/:phaseId/tasks/:taskId", [
      phaseMiddleware.validateCompleteTaskRequest,
      PhaseController.markTaskCompleted
    ])

    /***
    * @router  PUT: /api/phases/:phaseId/tasks/:taskId/reopen
    * @desc    Reopen a task.
    * @access  Public
    * ***/
    this.app.put("/api/phases/:phaseId/tasks/:taskId/reopen", [
      PhaseController.reopenTask
    ])

    return this.app;
  }
}
