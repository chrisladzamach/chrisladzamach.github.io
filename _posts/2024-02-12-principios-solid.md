---
title: "SOLID más allá de la teoría"
description: "Ejemplos concretos de cómo los cinco principios SOLID mejoran la mantenibilidad de tu código."
categories: [tecnico]
tags: ["solid", "clean-code", "refactorización", "oop"]
image: "/assets/images/post-solid.svg"
published: true
---

Los principios **SOLID** son cinco reglas de diseño orientado a objetos que, aplicadas con criterio, hacen que el código sea más fácil de entender, extender y probar.

## S - Single Responsibility Principle

Una clase debe tener una, y solo una, razón para cambiar. Si tu `UserService` maneja autenticación, notificaciones y auditoría, probablemente esté haciendo demasiado.

## O - Open/Closed Principle

El código debe estar abierto a la extensión pero cerrado a la modificación. En lugar de añadir un `if` cada vez que aparece un nuevo caso, usa polimorfismo o estrategias.

## L - Liskov Substitution Principle

Las clases hijas deben poder sustituir a sus padres sin alterar el comportamiento esperado. Si un `Square` hereda de `Rectangle` y rompe la lógica de área, hay una violación de Liskov.

## I - Interface Segregation Principle

Es mejor tener varias interfaces pequeñas y específicas que una sola interface gigante. Ningún cliente debería depender de métodos que no usa.

## D - Dependency Inversion Principle

Depender de abstracciones, no de concreciones. Esto es la base de la inyección de dependencias y de la arquitectura limpa.

## Recomendación práctica

No apliques SOLID de forma dogmática. Pregúntate si el cambio que estás haciendo reduce el costo de mantenimiento a seis meses vista. Si la respuesta es sí, vas por buen camino.
