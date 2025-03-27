/**
 * @fileoverview Unit test cho IUnitOfWork
 * @since 1.0.0
 */

import { IUnitOfWork } from "./unit-of-work";
import { AbstractDomainEvent } from "../../events/domain-event";
import { IEventBus } from "../../events/event-bus";

describe("IUnitOfWork", () => {
  describe("interface", () => {
    it("nên có thể triển khai các phương thức", async () => {
      // Arrange
      const mockEventBus: IEventBus = {
        publish: jest.fn().mockResolvedValue(undefined)
      };
      
      class TestUnitOfWork implements IUnitOfWork {
        private events: AbstractDomainEvent[] = [];
        private eventBus: IEventBus;
        
        constructor(eventBus: IEventBus) {
          this.eventBus = eventBus;
        }
        
        async execute<T>(work: () => Promise<T>): Promise<T> {
          try {
            const result = await work();
            await this.commit();
            return result;
          } catch (error) {
            await this.rollback();
            throw error;
          }
        }
        
        async commit(): Promise<void> {
          if (this.events.length > 0) {
            await this.eventBus.publish(this.events);
            this.events = [];
          }
        }
        
        async rollback(): Promise<void> {
          this.events = [];
        }
        
        // Helper method for unit test
        registerEvents(events: AbstractDomainEvent[]): void {
          this.events.push(...events);
        }
      }
      
      // Act
      const unitOfWork = new TestUnitOfWork(mockEventBus);
      
      // Assert
      expect(unitOfWork).toBeDefined();
      expect(typeof unitOfWork.execute).toBe("function");
      expect(typeof unitOfWork.commit).toBe("function");
      expect(typeof unitOfWork.rollback).toBe("function");
    });
  });
  
  describe("execute", () => {
    it("nên thực thi work function và commit khi thành công", async () => {
      // Arrange
      const mockEventBus: IEventBus = {
        publish: jest.fn().mockResolvedValue(undefined)
      };
      
      class TestUnitOfWork implements IUnitOfWork {
        private events: AbstractDomainEvent[] = [];
        private eventBus: IEventBus;
        public commitCalled = false;
        public rollbackCalled = false;
        
        constructor(eventBus: IEventBus) {
          this.eventBus = eventBus;
        }
        
        async execute<T>(work: () => Promise<T>): Promise<T> {
          try {
            const result = await work();
            await this.commit();
            return result;
          } catch (error) {
            await this.rollback();
            throw error;
          }
        }
        
        async commit(): Promise<void> {
          this.commitCalled = true;
          if (this.events.length > 0) {
            await this.eventBus.publish(this.events);
            this.events = [];
          }
        }
        
        async rollback(): Promise<void> {
          this.rollbackCalled = true;
          this.events = [];
        }
        
        // Helper for testing
        registerEvents(events: AbstractDomainEvent[]): void {
          this.events.push(...events);
        }
        
        get registeredEvents(): AbstractDomainEvent[] {
          return [...this.events];
        }
      }
      
      // Act
      const unitOfWork = new TestUnitOfWork(mockEventBus);
      const workFn = jest.fn().mockResolvedValue("result");
      const result = await unitOfWork.execute(workFn);
      
      // Assert
      expect(workFn).toHaveBeenCalledTimes(1);
      expect(result).toBe("result");
      expect(unitOfWork.commitCalled).toBe(true);
      expect(unitOfWork.rollbackCalled).toBe(false);
    });
    
    it("nên rollback khi work function throws error", async () => {
      // Arrange
      const mockEventBus: IEventBus = {
        publish: jest.fn().mockResolvedValue(undefined)
      };
      
      class TestUnitOfWork implements IUnitOfWork {
        private events: AbstractDomainEvent[] = [];
        private eventBus: IEventBus;
        public commitCalled = false;
        public rollbackCalled = false;
        
        constructor(eventBus: IEventBus) {
          this.eventBus = eventBus;
        }
        
        async execute<T>(work: () => Promise<T>): Promise<T> {
          try {
            const result = await work();
            await this.commit();
            return result;
          } catch (error) {
            await this.rollback();
            throw error;
          }
        }
        
        async commit(): Promise<void> {
          this.commitCalled = true;
          if (this.events.length > 0) {
            await this.eventBus.publish(this.events);
            this.events = [];
          }
        }
        
        async rollback(): Promise<void> {
          this.rollbackCalled = true;
          this.events = [];
        }
        
        // Helper for testing
        registerEvents(events: AbstractDomainEvent[]): void {
          this.events.push(...events);
        }
      }
      
      // Act
      const unitOfWork = new TestUnitOfWork(mockEventBus);
      const error = new Error("Test error");
      const workFn = jest.fn().mockRejectedValue(error);
      
      // Assert
      await expect(unitOfWork.execute(workFn)).rejects.toThrow(error);
      expect(workFn).toHaveBeenCalledTimes(1);
      expect(unitOfWork.commitCalled).toBe(false);
      expect(unitOfWork.rollbackCalled).toBe(true);
    });
  });
  
  describe("commit", () => {
    it("nên publish tất cả events đã đăng ký và xóa chúng", async () => {
      // Arrange
      const publishMock = jest.fn().mockResolvedValue(undefined);
      const mockEventBus: IEventBus = {
        publish: publishMock
      };
      
      class TestUnitOfWork implements IUnitOfWork {
        private events: AbstractDomainEvent[] = [];
        private eventBus: IEventBus;
        
        constructor(eventBus: IEventBus) {
          this.eventBus = eventBus;
        }
        
        async execute<T>(work: () => Promise<T>): Promise<T> {
          try {
            const result = await work();
            await this.commit();
            return result;
          } catch (error) {
            await this.rollback();
            throw error;
          }
        }
        
        async commit(): Promise<void> {
          if (this.events.length > 0) {
            await this.eventBus.publish(this.events);
            this.events = [];
          }
        }
        
        async rollback(): Promise<void> {
          this.events = [];
        }
        
        // Helper for testing
        registerEvents(events: AbstractDomainEvent[]): void {
          this.events.push(...events);
        }
        
        get registeredEvents(): AbstractDomainEvent[] {
          return [...this.events];
        }
      }
      
      // Act
      const unitOfWork = new TestUnitOfWork(mockEventBus);
      const event1 = new class TestEvent1 extends AbstractDomainEvent {}();
      const event2 = new class TestEvent2 extends AbstractDomainEvent {}();
      
      unitOfWork.registerEvents([event1, event2]);
      await unitOfWork.commit();
      
      // Assert
      expect(publishMock).toHaveBeenCalledTimes(1);
      expect(publishMock).toHaveBeenCalledWith([event1, event2]);
      expect(unitOfWork.registeredEvents).toHaveLength(0);
    });
    
    it("nên không gọi publish nếu không có events", async () => {
      // Arrange
      const publishMock = jest.fn().mockResolvedValue(undefined);
      const mockEventBus: IEventBus = {
        publish: publishMock
      };
      
      class TestUnitOfWork implements IUnitOfWork {
        private events: AbstractDomainEvent[] = [];
        private eventBus: IEventBus;
        
        constructor(eventBus: IEventBus) {
          this.eventBus = eventBus;
        }
        
        async execute<T>(work: () => Promise<T>): Promise<T> {
          try {
            const result = await work();
            await this.commit();
            return result;
          } catch (error) {
            await this.rollback();
            throw error;
          }
        }
        
        async commit(): Promise<void> {
          if (this.events.length > 0) {
            await this.eventBus.publish(this.events);
            this.events = [];
          }
        }
        
        async rollback(): Promise<void> {
          this.events = [];
        }
      }
      
      // Act
      const unitOfWork = new TestUnitOfWork(mockEventBus);
      await unitOfWork.commit();
      
      // Assert
      expect(publishMock).not.toHaveBeenCalled();
    });
  });
  
  describe("rollback", () => {
    it("nên xóa tất cả events đã đăng ký", async () => {
      // Arrange
      const mockEventBus: IEventBus = {
        publish: jest.fn().mockResolvedValue(undefined)
      };
      
      class TestUnitOfWork implements IUnitOfWork {
        private events: AbstractDomainEvent[] = [];
        private eventBus: IEventBus;
        
        constructor(eventBus: IEventBus) {
          this.eventBus = eventBus;
        }
        
        async execute<T>(work: () => Promise<T>): Promise<T> {
          try {
            const result = await work();
            await this.commit();
            return result;
          } catch (error) {
            await this.rollback();
            throw error;
          }
        }
        
        async commit(): Promise<void> {
          if (this.events.length > 0) {
            await this.eventBus.publish(this.events);
            this.events = [];
          }
        }
        
        async rollback(): Promise<void> {
          this.events = [];
        }
        
        // Helper for testing
        registerEvents(events: AbstractDomainEvent[]): void {
          this.events.push(...events);
        }
        
        get registeredEvents(): AbstractDomainEvent[] {
          return [...this.events];
        }
      }
      
      // Act
      const unitOfWork = new TestUnitOfWork(mockEventBus);
      const event1 = new class TestEvent1 extends AbstractDomainEvent {}();
      const event2 = new class TestEvent2 extends AbstractDomainEvent {}();
      
      unitOfWork.registerEvents([event1, event2]);
      await unitOfWork.rollback();
      
      // Assert
      expect(unitOfWork.registeredEvents).toHaveLength(0);
      expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
  });
}); 