import { Field } from './decorators/field/field.decorator';
import { Model } from './decorators/model/model.decorator';
import { FieldType } from './interfaces';
import {
  castModel,
  getInvalidFields,
  getModelFieldKeys,
  getModelFieldOptions,
  isModel,
} from './utils';

describe('shared-models: utils', () => {
  describe('getModelFieldKeys()', () => {
    it('should return empty array when fields is not defined', () => {
      @Model({})
      class Test {}

      const result = getModelFieldKeys(Test);

      expect(result).toStrictEqual([]);
    });

    it('should return field keys array', () => {
      @Model({})
      class Test {
        @Field({}) test1!: any;
        @Field({}) test2!: any;
        @Field({}) test3!: any;
      }

      const result = getModelFieldKeys(Test);

      expect(result).toStrictEqual(['test1', 'test2', 'test3']);
    });
  });

  describe('getModelFieldOptions', () => {
    it('should return options', () => {
      const options = { required: true, type: FieldType.password };

      @Model({})
      class Test {
        @Field(options) test!: string;
      }

      expect(getModelFieldOptions(new Test(), 'test')).toStrictEqual(options);
    });
  });

  describe('isModel', () => {
    it('should return true when model type', () => {
      @Model({})
      class Test {
        @Field({}) test!: string;
      }

      expect(isModel(new Test())).toBe(true);
    });

    it('should return false when other type', () => {
      expect(isModel(new Date())).toBe(false);
    });
  });

  describe('getInvalidFields', () => {
    it('should return empty array when correct', () => {
      @Model({})
      class Test {
        @Field({}) test!: string;
        @Field({
          required: true,
        })
        test2!: string;
        @Field({
          create: {
            required: true,
          },
        })
        test3!: string;
        @Field({
          create: {
            required: false,
          },
        })
        test4!: string;
      }

      const instance = new Test();
      instance.test2 = '12';
      instance.test3 = '21';

      expect(getInvalidFields(instance, 'create', null as any).length).toBe(0);
    });

    it('should return array when incorrect', () => {
      @Model({})
      class Test {
        @Field({}) test!: string;
        @Field({
          required: true,
        })
        test2!: string;
        @Field({
          create: {
            required: true,
          },
        })
        test3!: string;
        @Field({
          create: {
            required: false,
          },
        })
        test4!: string;
      }

      const instance = new Test();
      instance.test2 = '12';

      expect(getInvalidFields(instance, 'create', null as any).length).toBe(1);
    });

    it('should return empty array when not model', () => {
      expect(getInvalidFields(new Date(), 'create', null as any).length).toBe(
        0,
      );
    });
  });

  describe('castModel', () => {
    it('should remove unused fields', () => {
      @Model({})
      class Test {
        @Field({}) test!: string;
        @Field({
          create: true,
        })
        test2!: string;
      }

      const instance = new Test();
      instance.test = 'asd';
      instance.test2 = 'aaa';

      castModel(instance, 'create', null as any);

      expect(instance.test).not.toBeDefined();
      expect(instance.test2).toBeDefined();
    });
  });
});
