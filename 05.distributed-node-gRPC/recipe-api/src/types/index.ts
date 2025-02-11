import grpc from '@grpc/grpc-js';

interface MetaDataResponse {
  pid: number;
}

interface Ingredient {
  id: number;
  name: string;
  quantity: string;
}

interface Recipe {
  id: number;
  name: string;
  steps: string;
  ingredients: Ingredient[];
}

interface GetRecipeRequest {
  id: number;
}

interface RecipeServiceHandlers extends grpc.UntypedServiceImplementation {
  getMetaData: grpc.handleUnaryCall<unknown, MetaDataResponse>;
  getRecipe: grpc.handleUnaryCall<GetRecipeRequest, Recipe>;
}

export {
  MetaDataResponse,
  Ingredient,
  Recipe,
  GetRecipeRequest,
  RecipeServiceHandlers,
};
