package com.example.SkinCareSellProductSysterm.mapper;

import com.example.SkinCareSellProductSysterm.DTO.OrderRequest;
import com.example.SkinCareSellProductSysterm.Entity.Order;
import com.example.SkinCareSellProductSysterm.Utils.OrderStatus;
import org.modelmapper.PropertyMap;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderMapper extends PropertyMap<OrderRequest, Order> {
    @Override
    protected void configure() {
        map().setCreatedAt(LocalDateTime.now());
        map().setTotalPrice(BigDecimal.ZERO);
        map().setOrderStatus(OrderStatus.PENDING);
    }
}
