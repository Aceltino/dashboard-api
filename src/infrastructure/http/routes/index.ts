import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";

const router = Router();
const dashboardController = new DashboardController();

/**
 * @openapi
 * /healthz:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get("/healthz", (req, res) => {
  return res.status(200).json({ success: true, message: "OK" });
});

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get dashboard data (dynamic)
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [pie, line, bar]
 *         required: true
 *         description: Type of chart
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in ISO format
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in ISO format
 *     responses:
 *       200:
 *         description: Dashboard data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
type ExpressRequest = import("express").Request;
type ExpressResponse = import("express").Response;
type ExpressNext = import("express").NextFunction;

const asyncHandler = (
  fn: (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext,
  ) => Promise<unknown>,
) => {
  return (req: ExpressRequest, res: ExpressResponse, next: ExpressNext) => {
    fn(req, res, next).catch(next);
  };
};

router.get(
  "/dashboard",
  asyncHandler((req, res) => dashboardController.handle(req, res)),
);

export default router;
