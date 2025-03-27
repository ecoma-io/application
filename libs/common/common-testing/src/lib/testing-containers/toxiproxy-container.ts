import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import * as toxiProxyClient from "toxiproxy-node-client";

/**
 * Cổng mặc định để kiểm soát ToxiProxy
 */
const CONTROL_PORT = 8474;

/**
 * Cổng đầu tiên được sử dụng cho các proxy
 */
const FIRST_PROXIED_PORT = 8666;

/**
 * Mảng các cổng được sử dụng cho các proxy
 */
const PORT_ARRAY = Array.from({ length: 32 }, (_, i) => i + FIRST_PROXIED_PORT);

/**
 * Interface mô tả một proxy đã được tạo
 */
export interface ICreatedProxy {
  /**
   * Host của proxy
   */
  host: string;

  /**
   * Cổng của proxy
   */
  port: number;

  /**
   * Instance của proxy
   */
  instance: toxiProxyClient.Proxy;

  /**
   * Hàm để bật/tắt proxy
   * @param enabled - Trạng thái bật/tắt
   * @returns Promise với instance proxy đã được cập nhật
   */
  setEnabled: (enabled: boolean) => Promise<toxiProxyClient.Proxy>;
}

// Export this so that types can be used externally
export { toxiProxyClient as TPClient };

/**
 * Container ToxiProxy dùng để mô phỏng các lỗi mạng trong kiểm thử
 */
export class ToxiProxyContainer extends GenericContainer {
  /**
   * Khởi tạo một container ToxiProxy
   * @param image - Image Docker của ToxiProxy, mặc định là "ghcr.io/shopify/toxiproxy:2.11.0"
   */
  constructor(image = "ghcr.io/shopify/toxiproxy:2.11.0") {
    super(image);

    this.withExposedPorts(CONTROL_PORT, ...PORT_ARRAY)
      .withWaitStrategy(Wait.forHttp("/version", CONTROL_PORT))
      .withStartupTimeout(30_000);
  }

  /**
   * Khởi động container ToxiProxy
   * @returns Promise với instance StartedToxiProxyContainer
   */
  public override async start(): Promise<StartedToxiProxyContainer> {
    return new StartedToxiProxyContainer(await super.start());
  }
}

/**
 * Container ToxiProxy đã được khởi động
 */
export class StartedToxiProxyContainer extends AbstractStartedContainer {
  /**
   * Client để tương tác với ToxiProxy
   */
  public readonly client: toxiProxyClient.Toxiproxy;

  /**
   * Khởi tạo một StartedToxiProxyContainer
   * @param startedTestContainer - Container đã được khởi động
   */
  constructor(startedTestContainer: StartedTestContainer) {
    super(startedTestContainer);

    this.client = new toxiProxyClient.Toxiproxy(`http://${this.getHost()}:${this.getMappedPort(CONTROL_PORT)}`);
  }

  /**
   * Tạo một proxy mới
   * @param createProxyBody - Thông tin cấu hình proxy
   * @returns Promise với thông tin proxy đã được tạo
   * @throws Error khi không còn cổng khả dụng
   */
  public async createProxy(createProxyBody: Omit<toxiProxyClient.ICreateProxyBody, "listen">): Promise<ICreatedProxy> {
    // Firstly get the list of proxies to find the next available port
    const proxies = await this.client.getAll();

    const usedPorts = PORT_ARRAY.reduce(
      (acc, port) => {
        acc[port] = false;
        return acc;
      },
      {} as Record<string, boolean>
    );

    for (const proxy of Object.values(proxies)) {
      const lastColon = proxy.listen.lastIndexOf(":");
      const port = parseInt(proxy.listen.substring(lastColon + 1), 10);
      usedPorts[port] = true;
    }

    // Find the first available port
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const port = Object.entries(usedPorts).find(([_, used]) => !used);
    if (!port) {
      throw new Error("No available ports left");
    }

    const listen = `0.0.0.0:${port[0]}`;

    const proxy = await this.client.createProxy({
      ...createProxyBody,
      listen,
    });

    const setEnabled = (enabled: boolean) =>
      proxy.update({
        enabled,
        listen,
        upstream: createProxyBody.upstream,
      });

    return {
      host: this.getHost(),
      port: this.getMappedPort(parseInt(port[0], 10)),
      instance: proxy,
      setEnabled,
    };
  }
}