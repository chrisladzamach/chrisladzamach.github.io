---
title: "Arquitectura Limpia en proyectos reales"
description: "Cómo aplicar los principios de Clean Architecture sin complicar el día a día del equipo de desarrollo."
categories: [tecnico]
tags: ["arquitectura", "clean-code", "backend", "ddd"]
image: "/assets/images/post-arquitectura.svg"
published: true
---

La **Arquitectura Limpia** propuesta por Robert C. Martin no es un framework ni una librería: es una filosofía para organizar el código de modo que las reglas de negocio estén protegidas de los detalles técnicos.

## ¿Por qué importa?

En proyectos pequeños es fácil depender directamente de la base de datos o del framework web. El problema aparece cuando:

- Queremos cambiar de ORM.
- Necesitamos extraer un servicio en microservicios.
- El framework deja de recibir soporte.

Una arquitectura limpa separa responsabilidades en capas concéntricas:

1. **Entidades**: reglas de negocio puras.
2. **Casos de uso**: orquestan la lógica de la aplicación.
3. **Adaptadores de interfaz**: controladores, presentadores, gateways.
4. **Frameworks y drivers**: bases de datos, UI, dispositivos externos.

## Regla de dependencia

> Las dependencias solo pueden apuntar hacia adentro.

Esto significa que los casos de uso no deben conocer detalles de HTTP ni de SQL. Si una capa interna necesita algo del exterior, se define una **interfaz** (puerto) que el exterior implementa (adaptador).

## Un ejemplo práctico

```python
# Caso de uso (capa interna)
class CreateOrder:
    def __init__(self, order_repository, payment_gateway):
        self.order_repository = order_repository
        self.payment_gateway = payment_gateway

    def execute(self, customer_id, items):
        order = Order.create(customer_id, items)
        self.payment_gateway.charge(order.total)
        self.order_repository.save(order)
        return order
```

Las implementaciones concretas de `OrderRepository` y `PaymentGateway` viven fuera del caso de uso.

## Conclusión

No hace falta aplicar todos los patrones desde el día uno. Empieza identificando las reglas de negocio más importantes y protegiéndolas de los detalles cambiantes. La arquitectura limpa es una inversión que paga dividendos a medida que el proyecto crece.
