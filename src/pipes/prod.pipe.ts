import { ArgumentMetadata, Injectable, NotAcceptableException, PipeTransform } from "@nestjs/common";
import { exception } from "console";
import { Order, ProdSort, ProdSortType } from "src/dto/prod.dto";

@Injectable()
export class ParseSortPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == undefined) return value
    switch (value) {
      case ProdSort.PRICE:
        return value
      default:
        throw new NotAcceptableException("参数不合法")
    }
  }
}

@Injectable()
export class ParseOrderPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value == undefined) return value
    switch (value) {
      case Order.ASC:
      case Order.DESC:
        return value
      default:
        throw new NotAcceptableException("参数不合法")
    }
  }
}