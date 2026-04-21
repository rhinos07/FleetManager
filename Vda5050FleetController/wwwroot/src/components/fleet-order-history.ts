import { OrderHistoryDto } from "../types/models";

export class FleetOrderHistory extends HTMLElement {
  private tableBodyEl: HTMLElement | null = null;

  constructor() {
    super();
  }

  connectedCallback(): void {
    this.render();
    this.tableBodyEl = this.querySelector("#historyRows");
    this.loadHistory();
  }

  private render(): void {
    this.innerHTML = `
      <h2>Order History</h2>
      <p class="muted">Completed and failed transport orders.</p>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Vehicle</th>
            <th>Created</th>
            <th>Started</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody id="historyRows">
          <tr><td colspan="8" class="muted">Loading …</td></tr>
        </tbody>
      </table>
    `;
  }

  public async loadHistory(): Promise<void> {
    if (!this.tableBodyEl) return;

    try {
      const response = await fetch("/fleet/orders/history");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const orders: OrderHistoryDto[] = await response.json();
      this.renderRows(orders);
    } catch (err) {
      if (this.tableBodyEl) {
        this.tableBodyEl.innerHTML =
          '<tr><td colspan="8" class="muted">Failed to load order history.</td></tr>';
      }
    }
  }

  private renderRows(orders: OrderHistoryDto[]): void {
    if (!this.tableBodyEl) return;

    if (orders.length === 0) {
      this.tableBodyEl.innerHTML =
        '<tr><td colspan="8" class="muted">No order history available</td></tr>';
      return;
    }

    this.tableBodyEl.innerHTML = orders
      .map(
        (o) => `
          <tr>
            <td>${this.esc(o.orderId)}</td>
            <td>${this.esc(o.sourceId)}</td>
            <td>${this.esc(o.destId)}</td>
            <td><span class="status-badge status-${o.finalStatus.toLowerCase()}">${this.esc(o.finalStatus)}</span></td>
            <td>${o.assignedVehicleId ? this.esc(o.assignedVehicleId) : "<span class='muted'>—</span>"}</td>
            <td>${this.formatDate(o.createdAt)}</td>
            <td>${o.startedAt ? this.formatDate(o.startedAt) : "<span class='muted'>—</span>"}</td>
            <td>${this.formatDate(o.completedAt)}</td>
          </tr>
        `
      )
      .join("");
  }

  private formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  private esc(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

customElements.define("fleet-order-history", FleetOrderHistory);
