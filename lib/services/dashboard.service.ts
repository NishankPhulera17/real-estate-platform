import { dashboardRepository } from "../repositories/dashboard.repository";

export class DashboardService {
  async getAdminDashboard() {
    return dashboardRepository.getAdminStats();
  }

  async getBuilderDashboard(builderId: string) {
    return dashboardRepository.getBuilderStats(builderId);
  }

  async getBrokerDashboard(brokerId: string) {
    return dashboardRepository.getBrokerStats(brokerId);
  }
}

export const dashboardService = new DashboardService();
