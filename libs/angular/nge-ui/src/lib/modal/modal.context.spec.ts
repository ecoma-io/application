import { OverlayRef } from "@angular/cdk/overlay";
import { ModalContext } from "./modal.context";

jest.useFakeTimers();

describe("ModalContext", () => {
  let overlayMock: jest.Mocked<OverlayRef>;
  let modalContext: ModalContext<string>;

  beforeEach(() => {
    overlayMock = { dispose: jest.fn() } as unknown as jest.Mocked<OverlayRef>;
    modalContext = new ModalContext<string>(overlayMock);
  });

  it("should close modal with a result", async () => {
    const resultPromise = modalContext.afterClosed().toPromise();
    modalContext.close("Success");
    await expect(resultPromise).resolves.toBe("Success");
    jest.runAllTimers();
    expect(overlayMock.dispose).toHaveBeenCalled();
  });

  it("should dismiss modal without a result", async () => {
    const resultPromise = modalContext.afterClosed().toPromise();
    modalContext.dismiss();
    await expect(resultPromise).resolves.toBeNull();
    jest.runAllTimers();
    expect(overlayMock.dispose).toHaveBeenCalled();
  });

  it("should not close twice", async () => {
    modalContext.close("First");
    modalContext.close("Second");
    jest.runAllTimers();
    expect(overlayMock.dispose).toHaveBeenCalledTimes(1);
  });

  it("should not dismiss twice", async () => {
    modalContext.dismiss();
    modalContext.dismiss();
    jest.runAllTimers();
    expect(overlayMock.dispose).toHaveBeenCalledTimes(1);
  });

  it("should return correct open state", () => {
    expect(modalContext.isOpen()).toBe(true);
    modalContext.close("Done");
    expect(modalContext.isOpen()).toBe(false);
  });
});
