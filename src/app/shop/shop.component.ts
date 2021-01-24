import { Component, OnInit } from '@angular/core';

interface BrickOrder {
  quantity: number,
  price: number
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  public quantity: number = 0;

  public quantityError: boolean = false;

  public warehouse: BrickOrder[] = [];

  public orderValue: number = 0;

  constructor() { }

  ngOnInit(): void {}

  public buyBricks(value: BrickOrder): void {
    this.warehouse.push({...value});
    this.quantity += value.quantity;
  }

  public sellBricks(value): void {
    if (this.quantity < value.quantity) {
      this.quantityError = true;
    } else {
      this.quantityError = false;
      this.quantity -= value.quantity;

      const toBeSold = this.releaseFromWarehouse(this.warehouse, value.quantity);
      this.updateWarehouse(this.warehouse, toBeSold);
      this.calculateSellPrice(toBeSold);
    }
  }

  public releaseFromWarehouseOrder(warehouseOrder: BrickOrder, toSell: number) {
    const calculateGoodsToRelease = () => {
      if (toSell > warehouseOrder.quantity) {
        return warehouseOrder.quantity;
      }

      return toSell;
    };

    const goodsToRelease = calculateGoodsToRelease();

    return {
      toRelease: {
        quantity: goodsToRelease,
        price: warehouseOrder.price,
      },
      rest: Math.abs(goodsToRelease - toSell),
    };
  };

  public releaseFromWarehouse(warehouse: BrickOrder[], toSellOrder: number): BrickOrder[] {
    let restToSell = toSellOrder;

    const toSell = warehouse.map(order => {
      const result = this.releaseFromWarehouseOrder(order, restToSell);
      restToSell = result.rest;

      return result.toRelease;
    });

    return toSell;
  };

  public updateWarehouse(warehouse: BrickOrder[], afterSell: BrickOrder[]): void {
    this.warehouse = warehouse.map((order, index) => ({
      quantity: order.quantity - afterSell[index].quantity,
      price: order.price,
    })).filter(order => order.quantity > 0);
  } 
   
  public calculateSellPrice(sellOrder: BrickOrder[]): void {
    sellOrder.forEach(order => {
      this.orderValue = this.orderValue + order.quantity * order.price;
    });
  };
}
