---
category: Java
status: 진행중
tags:
  - Java
---
### 1. `final`은 무엇을 막는가

변수 앞에 `final`을 붙이면 그 변수에는 **값을 한 번만 대입**할 수 있다. 이미 값이 들어간 뒤 다른 값을 다시 대입하려고 하면 컴파일 오류가 발생한다. 

그래서 "값이 변하지 않는다" 보다는 **변수에 다시 대입하는 행위를 막는다**로 이해하는 것이 정확하다.
```java
final int value = 10;

value = 20; // 컴파일 오류
```

### 2. `final` 필드와 생성자는 왜 자주 같이 보일까
```java
public class Member {

    private final String name;

    public Member(String name) {
        this.name = name;
    }
}
```
- `final`을 클래스의 필드에 붙이면 **각 객체의 해당 필드는 한 번 초기화된 이후 다른 값으로 바꿀 수 없다.**
- `new Member("kim")`을 실행하면 객체가 생성되는 과정에서 생성자가 실행되고 `this.name`에 `"kim"`이 들어간다.
	- 그 시점 이후에는 다시 바꿀 수 없다.

이 구조가 가능한 이유는 `final` 필드를 반드시 선언과 동시에 초기화해야 하는 것은 아니고, **생성자가 끝날 때까지는 반드시 한 번 초기화되도록 만들 수 있기 때문**이다. 

이 규칙은 객체마다 서로 다른 값을 가지면서도, 객체가 만들어진 뒤에는 그 값을 다시 바꾸고 싶지 않을 때 유용하다.
```java
Member member1 = new Member("kim");
Member member2 = new Member("lee");
```
- 두 객체의 `name`은 서로 다르지만 각각 객체가 만들어질 때 한 번 결정된다는 의미

#### 이 패턴은 Spring 코드에서 자주 만난다
```java
@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

`OrderService`가 만들어질 때 사용할 `OrderRepository`가 생성자를 통해 정해지고, 그 이후에는 다른 저장소 객체로 다시 바꿀 수 없다. 그래서 생성자 주입 코드에서 `private final` 필드를 자주 보게 된다.

여기서 `final`은 Spring만의 기능이 아니라 **Java가 필드 재대입을 막아 주는 언어 기능**이고, Spring은 그 구조를 이용하는 것이다.

즉, **`OrderService`가 생성될 때 정해진 `OrderRepository`를 계속 사용하고, 이후 다른 `OrderRepository` 객체로 교체하지 않겠다.**

다만 `final`이라고 해서 객체 자체가 자동으로 완전히 불변이 되는 것은 아니다.

### 3. 참조형에 `final`을 붙였을 때 가장 중요하다
```java
final int number = 10;
```
- 기본형에서 `number` 안에는 `10`이라는 값이 있으므로 다른 값으로 교체할 수 없다.
<br>

```java
final Data data = new Data();

data = new Data(); // 컴파일 오류
```
- 참조형에서는 `data`안에 들어 있는 것은 `Data` 객체 자체게 아니라 그 객체를 가리키는 **참조값**이다. 
- 따라서 `final`이 막는 것은 이 참조값을 다른 객체의 참조값으로 바꾸는 것이다.
<br>

```java
final Data data = new Data();

data.value = 10;
data.value = 20;
```
- 위 코드는 가능하다.
- `data`안에 들어 있는 참조값은 한 번도 변경되지 않았기 때문이다. 계속 같은 `Data`객체를 가리키고 있고, 단지 **그 객체 내부의 `value`가 변경된 것**이다.
```
data ───────────▶ Data 객체
final             value = 10 → 20
```
<br>

```java
final int[] numbers = {1, 2, 3};

numbers[0] = 100;       // 가능
numbers = new int[3];   // 컴파일 오류
```
- `members[0]`을 변경하는 것은 배열 객체 내부를 변경하는 것이고, **`numbers = new int[3]`은 변수가 다른 배열을 가리키도록 참조값을 바꾸는 것이므로 막힌다.**

### 4. `static final`과 상수는 왜 함께 사용하는가

`static`은 객체마다 따로 가지는 값이 아니라 **클래스에 하나 존재하는 값**이라고 배웠다. 여기에 `final`을 같이 사용하면 **클래스 전체에서 하나만 존재하면서 한 번 정해진 뒤 다시 바꿀 수 없는 값**을 만들 수 있다.
```java
public class Constant {

    public static final double PI = 3.141592;
    public static final int MAX_USERS = 1000;
}
```
  - `PI`는 특정 `Constant` 객체마다 다른 값일 이유가 없고 모든 코드가 같은 값을 사용해야 한다.
  - 따라서 인스턴스 필드보다 `static`이 맞다. 그리고 실행 도중 값이 변경되어서도 안 되므로 `final`을 함께 사용한다.
  - 사용할 때는 객체를 만들지 않고 클래스 이름으로 접근한다.
<br>
- `private final String name;`
	- **객체마다 하나씩 존재하고 객체별로 서로 다른 값을 가질 수 있지만,** 각 객체 앞에서는 다시 대입하지 못하는 값
- `public static final int MAX_USERS = 1000;`
	- **객체와 관계없이 클래스에 하나만 존재**하며 다시 대입할 수도 없는 값

### 5. 변수 외에도 클래스와 메서드에 `final`을 사용할 수 있다

`final`은 변수에서 "`다시 대입할 수 없다`"는 제약을 걸었다면 클래스나 메서드에서는 **상속을 통해 더 변경되는 것을 막는 역할**을 한다.
```java
public final class Member { ... }

class SpecialMember extends Member { ... }  // 컴파일 오류
```
