## Decorators
### @Model Decorator
Used to annotate a class as a "model," adding metadata and a custom toJSON method. This method serializes the instance 
into JSON format, including fields marked with specific metadata. Associates the model with metadata (IModelOptions) 
using reflection, allowing for dynamic handling of models at runtime.

### @Field Decorator
Used to annotate properties of a model class, providing additional metadata (IFieldOptions) such as field type, 
requirements, and custom behavior for serialization or validation. Defines how properties should be accessed, mutated, 
and serialized, including special handling for arrays and specific types.

## Utility Functions
### Metadata Retrieval
Functions like **getModelFieldKeys**, **getModelFieldOptions**, **getModelFieldsWithOptions**, and **getModelOptions**
are used to retrieve metadata about models and their fields. This enables dynamic inspection and manipulation of models.

### Model Validation
**getInvalidFields** - Checks for fields that have invalid values based on specified rules 
(such as being required during "create" or "update" operations) and permissions. This is useful for form validation or 
API input validation.

### Model Casting
**castModel** - Adjusts an instance of a model by removing fields that do not conform to the specified mode 
("create", "update") or the provided permissions. This ensures the instance is valid and adheres to the constraints
defined by the model's metadata.

### Model Check
**isModel** - Determines if an object is a model decorated with the @Model decorator.
