import {
  ChartType,
  DashboardChartEntry,
  DashboardLineEntry,
} from "../../application/use-cases/get-dashboard-data.use-case";

export interface DashboardDataResponse {
  type: ChartType;
  data: DashboardChartEntry[] | DashboardLineEntry[];
}
