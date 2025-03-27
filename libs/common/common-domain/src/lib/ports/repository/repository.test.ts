/**
 * @fileoverview Unit test cho Repository interfaces
 * @since 1.0.0
 */

import { IRepository } from "./repository";
import { IReadRepository } from "./read-repository";
import { IWriteRepository } from "./write-repository";
import { AbstractDomainEvent } from "../../events/domain-event";
import { AbstractAggregate } from "../../aggregates/aggregate";
import { AbstractId } from "../../value-object/id/base-id";
import { IOffsetPagination, IOffsetBasedPaginatedResult, ICursorAheadPagination, ICursorBackPagination, ICursorBasedPaginatedResult } from "../query/pagination";
import { IQuerySpecification } from "../query/query-specification";

// Test implementation classes
class TestEvent extends AbstractDomainEvent {}

// Define a test ID class
class TestId extends AbstractId {
  static create(value = "test-id"): TestId {
    return new TestId(value);
  }
}

class TestAggregate extends AbstractAggregate<TestId> {
  constructor(id: TestId) {
    super(id);
  }
}

describe("Repository Interfaces", () => {
  describe("IRepository", () => {
    it("nên có thể triển khai interface", () => {
      // Arrange
      class TestRepository implements IRepository<TestId, TestAggregate> {
        async findById(id: TestId): Promise<TestAggregate | null> {
          return new TestAggregate(id);
        }
        
        async find(): Promise<TestAggregate[]> {
          return [new TestAggregate(TestId.create("1")), new TestAggregate(TestId.create("2"))];
        }
        
        async findWithOffsetPagination(): Promise<any> {
          return { items: [], total: 0, hasMore: false };
        }
        
        async findWithCursorPagination(): Promise<any> {
          return { items: [], hasNext: false, hasPrevious: false };
        }
        
        async save(entity: TestAggregate): Promise<void> {
          // Implementation
        }
        
        async delete(id: TestId): Promise<void> {
          // Implementation
        }
        
        async deleteMany(ids: TestId[]): Promise<void> {
          // Implementation
        }
      }
      
      // Act
      const repo = new TestRepository();
      
      // Assert
      expect(repo).toBeDefined();
      expect(typeof repo.findById).toBe("function");
      expect(typeof repo.save).toBe("function");
    });
    
    it("nên kết hợp đúng với ReadRepository và WriteRepository", () => {
      // Arrange
      class TestRepository 
        implements IReadRepository<TestId, TestAggregate>, IWriteRepository<TestId, TestAggregate> {
        
        async findById(id: TestId): Promise<TestAggregate | null> {
          return new TestAggregate(id);
        }
        
        async find(): Promise<TestAggregate[]> {
          return [new TestAggregate(TestId.create("1")), new TestAggregate(TestId.create("2"))];
        }
        
        async findWithOffsetPagination(): Promise<any> {
          return { items: [], total: 0, hasMore: false };
        }
        
        async findWithCursorPagination(): Promise<any> {
          return { items: [], hasNext: false, hasPrevious: false };
        }
        
        async save(entity: TestAggregate): Promise<void> {
          // Implementation
        }
        
        async delete(id: TestId): Promise<void> {
          // Implementation
        }
        
        async deleteMany(ids: TestId[]): Promise<void> {
          // Implementation
        }
      }
      
      // Act
      const repo = new TestRepository();
      
      // Assert
      expect(repo).toBeDefined();
      expect(typeof repo.findById).toBe("function");
      expect(typeof repo.find).toBe("function");
      expect(typeof repo.save).toBe("function");
      expect(typeof repo.delete).toBe("function");
    });
  });
  
  describe("IReadRepository", () => {
    it("nên có thể triển khai interface", async () => {
      // Arrange
      class TestReadRepository implements IReadRepository<TestId, TestAggregate> {
        async findById(id: TestId): Promise<TestAggregate | null> {
          return id.value === "exists" ? new TestAggregate(id) : null;
        }
        
        async find(): Promise<TestAggregate[]> {
          return [new TestAggregate(TestId.create("1")), new TestAggregate(TestId.create("2"))];
        }
        
        async findWithOffsetPagination(): Promise<any> {
          return { items: [], total: 0, hasMore: false };
        }
        
        async findWithCursorPagination(): Promise<any> {
          return { items: [], hasNext: false, hasPrevious: false };
        }
      }
      
      // Act
      const repo = new TestReadRepository();
      const foundEntity = await repo.findById(TestId.create("exists"));
      const notFoundEntity = await repo.findById(TestId.create("not-exists"));
      const allEntities = await repo.find();
      
      // Assert
      expect(foundEntity).toBeInstanceOf(TestAggregate);
      expect(foundEntity?.id.value).toBe("exists");
      expect(notFoundEntity).toBeNull();
      expect(allEntities).toHaveLength(2);
      expect(allEntities[0].id.value).toBe("1");
      expect(allEntities[1].id.value).toBe("2");
    });
  });
  
  describe("IWriteRepository", () => {
    it("nên có thể triển khai interface", () => {
      // Arrange
      class TestWriteRepository implements IWriteRepository<TestId, TestAggregate> {
        public savedEntity: TestAggregate | null = null;
        public deletedId: TestId | null = null;
        
        async save(entity: TestAggregate): Promise<void> {
          this.savedEntity = entity;
        }
        
        async delete(id: TestId): Promise<void> {
          this.deletedId = id;
        }
        
        async deleteMany(ids: TestId[]): Promise<void> {
          // Implementation
        }
      }
      
      // Act
      const repo = new TestWriteRepository();
      const id = TestId.create("test-id");
      const entity = new TestAggregate(id);
      
      // Assert
      expect(async () => await repo.save(entity)).not.toThrow();
      expect(async () => await repo.delete(id)).not.toThrow();
    });
  });
}); 