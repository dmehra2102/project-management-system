import { DeepPartial, FindOneOptions, Repository } from "typeorm";

export type UpdateDataKeys<T> = keyof T & keyof DeepPartial<T>;

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  statusCode?: number;
}

export class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Creates a new entity using the provided data and saves it to the database.
   * @param entity - The data to create the entity with.
   * @returns An ApiResponse with the created entity data on success or an error message on failure.
   */
  async create(entity: DeepPartial<T>): Promise<ApiResponse<T>> {
    try {
      const createdEntity = await this.repository.create(entity);
      const savedEntity = await this.repository.save(createdEntity);

      return { statusCode: 201, status: "success", data: savedEntity };
    } catch (error) {
      // Check if the error is unique constraint violation
      if (error.code === "23505") {
        return { statusCode: 409, status: "error", message: error.detail };
      } else {
        return { statusCode: 500, status: "error", message: error.message };
      }
    }
  }

  /**
   * Updates an entity with the provided ID using the given update data.
   * @param id - The ID of the entity to be updated.
   * @param updateData - The data used to update the entity.
   * @returns An ApiResponse with status and updated entity data on success or an error message on failure.
   */
  async update(
    id: string,
    updateData: DeepPartial<T>
  ): Promise<ApiResponse<T> | undefined> {
    try {
      const isExist = await this.findOne(id);
      if (isExist.statusCode === 404) {
        return isExist;
      }

      const where = {};
      const primaryKey =
        this.repository.metadata.primaryColumns[0].databaseName;
      where[primaryKey] = id;

      const validColumns = this.repository.metadata.columns.map(
        (column) => column.propertyName
      );
      const updateQuery: any = {};
      const keys = Object.keys(updateData) as UpdateDataKeys<T>[];
      for (const key of keys) {
        if (
          updateData.hasOwnProperty(key) &&
          validColumns.includes(key as string)
        ) {
          updateQuery[key] = updateData[key];
        }
      }

      const result = await this.repository
        .createQueryBuilder()
        .update()
        .set(updateQuery)
        .where(where)
        .returning("*") // Use the RETURNING clause to get the updated row(s)
        .execute();

      if (result.affected > 0) {
        return { statusCode: 200, status: "success", data: result.raw[0] };
      } else {
        return {
          statusCode: 400,
          status: "error",
          data: null,
          message: "Invalid Data",
        };
      }
    } catch (error) {
      return { statusCode: 500, status: "error", message: error.message };
    }
  }

  /**
   * Finds an entity by its ID.
   * @param id - The ID of the entity to be retrieved.
   * @returns An ApiResponse with status and the retrieved entity data on success or an error message on failure.
   */
  async findOne(id: string): Promise<ApiResponse<T> | undefined> {
    try {
      const where = {};
      const primaryKey: string =
        this.repository.metadata.primaryColumns[0].databaseName;
      where[primaryKey] = id;

      const options: FindOneOptions<T> = { where: where };

      const data = await this.repository.findOne(options);

      if (data) {
        return { statusCode: 200, status: "success", data: data };
      } else {
        return { statusCode: 404, status: "error", message: "Not Found" };
      }
    } catch (error) {
      return { statusCode: 500, status: "error", message: error.message };
    }
  }

  /**
   * Finds all entities based on the provided query parameters.
   * @param queryParams - The query parameters to filter the entities.
   * @returns An ApiResponse with status and an array of retrieved entity data on success or an error message on failure.
   */
  async findAll(queryParams: object): Promise<ApiResponse<T[]>> {
    try {
      let data = [];
      if (Object.keys(queryParams).length > 0) {
        const query = await this.repository.createQueryBuilder();
        for (const field in queryParams) {
          if (queryParams.hasOwnProperty(field)) {
            const value = queryParams[field];
            query.andWhere(`${field} = '${value}'`);
          }
        }
        data = await query.getMany();
      } else {
        data = await this.repository.find();
      }
      return { statusCode: 200, status: "success", data: data };
    } catch (error) {
      return {
        statusCode: 500,
        status: "error",
        data: [],
        message: error.message,
      };
    }
  }

  /**
   * Retrieves multiple records by their IDs from the database.
   *
   * @param {string[]} ids - An array of IDs used to fetch records.
   * @returns {Promise<ApiResponse<T[]>>} - A promise that resolves to an ApiResponse containing the retrieved data.
   */
  async findByIds(ids: string[]): Promise<ApiResponse<T[]>> {
    try {
      const primaryKey: string =
        this.repository.metadata.primaryColumns[0].databaseName;

      const data = await this.repository
        .createQueryBuilder()
        .where(`${primaryKey} IN (:...ids)`, { ids: ids })
        .getMany();

      return { statusCode: 200, status: "success", data: data };
    } catch (error) {
      return {
        statusCode: 500,
        status: "error",
        data: [],
        message: error.message,
      };
    }
  }

  /**
   * Deletes an entity based on the provided ID.
   * @param id - The ID of the entity to be deleted.
   * @returns An ApiResponse with status indicating success or error.
   */
  async delete(id: string): Promise<ApiResponse<T>> {
    try {
      const isExist = await this.findOne(id);
      if (isExist.statusCode === 404) {
        return isExist;
      }

      await this.repository.delete(id);
      return { statusCode: 200, status: "success" };
    } catch (error) {
      return { statusCode: 500, status: "error", message: error.message };
    }
  }

  /**
   * Executes a custom query on the database.
   *
   * @param {string} query - The custom query to be executed.
   * @returns {Promise<T[]>} - A promise that resolves to an array of results from the custom query.
   */
  async customQuery(query: string): Promise<T[]> {
    try {
      const data = await this.repository
        .createQueryBuilder()
        .where(query)
        .getMany();

      return data;
    } catch (error) {
      console.error(`Error while executing custom query: ${query}`, error);
      return [];
    }
  }
}
