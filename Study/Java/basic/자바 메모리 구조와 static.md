---
category: Java
status: 진행중
tags:
  - Java
  - static
  - JVM
---
### 1. 자바 프로그램이 실행될 때 메모리는 어떻게 사용되는가
```image-grid
columns: 2 gap: 12
![[Pasted image 20260916182558.png]] 
![[Pasted image 20260916182604.png]]
```
1. 힙에 객체가 존재하고 스택의 지역 변수가 그 객체를 참조하는 관계
2. 메서드 하나를 호출할 때 만들어지는 스택 프레임 내부 구조



```java
public class MemoryMain {

    public static void main(String[] args) {
        int number = 10;

        Counter counter = new Counter();
        counter.increase();

        int result = add(number, 20);
    }

    static int add(int a, int b) {
        int sum = a + b;
        return sum;
    }
}

class Counter {

    int count;

    void increase() {
        count++;
    }
}
```
- `main()`이 실행되면 현재 스레드의 Java 스택에 `main()`을 위한 **스택 프레임**이 만들어진다.
	- 이 프레임에는 `args`, `number`, `counter`, `result` 같은 지역 변수와 계산에 필요한 정보가 들어간다.
	- `number`처럼 기본형 값은 지역 변수 공간에 값 자체가 들어간다.
	- `counter`처럼 객체를 가리키는 변수에는 객체 자체가 아니라 그 객체를 찾아갈 수 있는 참조값이 들어간다.
- `new Counter()`로 만들어진 `Counter`인스턴스는 힙에 생성된다.


반면 `new Counter()`로 생성한 객체는 Heap에 존재하며, 스택의 `counter` 지역 변수는 그 객체의 참조값을 가지고 있다.


```
스택                         힙

main() 프레임
counter ──────────────────▶ Counter 객체
number = 10                 count = 0
```
 - `counter.increase()`를 호출하면 기존 `main()` 프레임 안에서 모든 일이 처리되는 것이 아니라 **`increase()`를 실행하기 위한 새로운 스택 프레임이 위에 추가**된다.
   
즉, **메서드가 호출될 때마다 새로운 프레임이 만들어지고, 메서드 실행이 끝나면 해당 프레임이 제거된다.** 프레임 안에는 지역 변수 공간과 계산을 위한 피연산자 스택 등이 존재한다.

이 과정은 `this`와도 연결된다. 인스턴스 메서드가 호출되면 JVM의 지역 변수 영역 [첫 번째 위치]{JVM 스택 플레임 내부의 `Local Variables(지역 변수 배열)`의 첫 번재 슬릇을 말한다.}에는 **그 메서드를 호출한 객체의 참조값이 전달**된다. Java 코드에서 이것은 `this`로 사용한다.

**지역 변수의 생명 주기는 해당 메서드 실행과 밀접하게 연결**된다. 재귀 호출을 너무 깊게 했을 때 `StackOverflowError`가 발생하는 것도 같은 구조에서 이해할 수 있다. 메서드가 끝나기 전에 다시 자신을 호출하면 이전 프레임이 제거되지 않은 상태에서 새로움 프레임이 계속 쌓이기 때문이다.

#### 지역 변수는 왜 메서드 실행과 생명 주기가 연결될까?
 **메서드 호출 → Stack Frame 생성 → 그 프레임 안에 Local Variables 존재 → 메서드 종료 → Stack Frame 제거** 
 재귀에서는 **메서드가 종료되기 전에 새로운 메서드 호출이 발생 → 새로운 Stack Frame 추가 → 호출이 깊어질수록 프레임 누적 → 스택 한계 초과 시 `StackOverflowError`**


### 2. 힙의 객체와 메서드는 어떤 관계인가
```java
class Member {

    String name;

    void introduce() {
        System.out.println(name);
    }
}
```
- `Member` 객체가 `name`이라는 상태와 `introduce()`라는 기능을 가지고 있다고 보는 것이 맞다.
- 메모리 관점에서는 `Member` 객체를 100개 만든다고 `introduce()`의 실행 코드도 100개 복사되는 것으로 이해하면 안 된다.


```java
Member member1 = new Member();
member1.name = "A";

Member member2 = new Member();
member2.name = "B";
```
- 각 객체마다 달라져야 하는 것은 `name`같은 **인스턴스의 상태**다.  


```
member1 ──▶ Member { name = "A" }

member2 ──▶ Member { name = "B" }
```
- 힙에는 서로 다른 두 객체가 만들어지고 각각 자신의 `name` 값을 가진다.

하지만 `introduce()`의 실행 코드는 클래스에 대한 정보와 함께 공통으로 관리된다. 

`member1.introduce()`를 호출했을 때와 `member2.introduce()`를 호출했을 때 서로 다른 메서드 코드가 실행되는 것이 아니라 **같은 메서드 코드를 실행하되 현재 객체를 나타내는 `this`가 달라지는 것**이다.
- `member1.introduce()`에서는 `this`가 `member1`의 객체를 가리키기 때문에 `"A"`가 나온다.
- `member2.introduce()`에서는 `this`가 `member2`의 객체를 가리키기 때문에 `"B"`가 나온다.

이 구조를 이해하면 **"같은 클래스의 메서드를 여러 객체가 사용하지만 각자의 상태를 변경한다."** 는 현상이 메모리 수준에서 어떻게 가능한지 연결된다.

- **메서드 영역은 이런 클래스별 정보를 공유하는 공간**이다. 메서드 영역에는 아래 내용들이 저장된다. 또한 이 영역은 [JVM 스레드가 공유]{하나의 메서드 영역에 있는 클래스 정보를 여러 스레드가 함께 사용}한다.
	- 클래스별 구조
	- 런타임 상수 풀
	- 필드와 메서드에 대한 정보
	- 메서드와 생성자의 코드

[네이버 D2의 Java Reference와 GC](https://d2.naver.com/helloworld/329631?utm_source=chatgpt.com)

### 3. static 변수는 왜 필요한가


```java
public class Car {

    String name;
    int count;

    public Car(String name) {
        this.name = name;
        count++;
    }
}

Car car1 = new Car("K3");
Car car2 = new Car("G80");
Car car3 = new Car("Model Y");
```
위 3개의 객체 생성 코드로 자동차의 전체 개수를 셀 수 있을 것 같지만 실제로는 그렇지 않다. `count`
가 **인스턴스 변수**이기 때문이다. 객체가 새로 만들어질 때마다 자신의 `count`는 따로 가진다.
```text
car1 → { name = "K3",     count = 1 }
car2 → { name = "G80",    count = 1 }
car3 → { name = "Model Y", count = 1 }
```

```java
public class Car {

    String name;
    static int count;
	..
}
```

이제 `name`은 자동차 객체마다 존재하지만 `count`는 `Car`클래스에 하나만 존재한다.
```
Car
count = 3

car1 → { name = "K3" }
car2 → { name = "G80" }
car3 → { name = "Model Y" }
```

Java 언어 명세에서도 `static`필드는 객체가 몇 개 만들어지는지와 관계없이 **하나만 존재하는 클래스 변수**라고 정의한다.

#### `static` 변수는 정확히 언제 만들어지는가

Java는 모든 클래스를 JVM 시작과 동시에 전부 초기화하지 않는다. 
1. 어떤 클래스로 객체를 처음 만들거나
2. 그 클래스의 `static` 메서드를 호출하거나
3. 일반적인 `static`필드를 처음 사용하는 등의 상황에서 클래스 초기화가 발생할 수 있다. 

```java
public class InitData {

    static int value = createValue();

    static int createValue() {
        System.out.println("static 초기화");
        return 10;
    }
}
```

`InitData`라는 소스 파일이 존재한다는 이유만으로 반드시 프로그램 시작 순간 `createValue()`가 실행되는 것은 아니다. 실제로 `InitData.value`를 사용하거나 `new InitData()`처럼 클래스 초기화를 요구하는 동작이 일어날 때 클래스가 초기화되고, 이 과정에서 `value` 초기화가 이루어진다.

|종류|무엇에 속하는가|생성·사용 범위|
|---|---|---|
|지역 변수|특정 메서드 호출|해당 스택 프레임이 존재하는 동안|
|인스턴스 변수|특정 객체|그 객체와 함께 존재|
|`static` 변수|클래스|클래스가 초기화되어 사용되는 동안 하나를 공유|

### 4. `static`메서드는 왜 인스턴스 변수를 바로 사용할 수 없는가
```java
public class DecoData {

    private int instanceValue;
    private static int staticValue;

    public void instanceCall() {
    }

    public static void staticCall() {
    }
}

// 인스턴스 메서드
DecoData data = new DecoData();
data.instanceCall();

// 정적 메서드
DacoData.staticCall();
```
- 인스턴스 메서드는 특정 객체를 통해 호출한다.
	- 이 호출에서는 어떤 `Decodata` 객체를 대상으로 실행해야 하는지가 분명하다. 
- **정적 메서드는 객체 없이 호출할 수 있다.**
```java
public static void staticCall() {
    System.out.println(instanceValue);
}
```
위 코드는 현재 객체가 없기 때문에 컴파일되지 않는다.

`instanceValue`는 객체마다 다른 값인데, 현재 어떤 객체의 `instanceValue`를 읽어야 하는지 결정할 수 없기 때문이다. 같은 이유로 정적 메서드 안에서는 `this`도 사용할 수 없다.

Java 언어 명세에서도 **정적 문맥에는 현재 인스턴스가 존재하지 않으므로 `this`를 사용할 수 없고, 객체를 지정하지 않은 채 인스턴스 필드나 인스턴스 메서드에 접근할 수 없다고 규정**한다.

> [!more]- `static` 메서드
> 정적 메서드에는 현재 객체를 가리키는 `this`가 존재하지 않는다.
> 
>인스턴스 필드는 객체마다 각각 존재하므로, 정적 메서드에서 `instanceValue`처럼 객체를 지정하지 않고 접근하면 **어느 객체의 값을 사용해야 하는지 알 수 없어 컴파일 오류가 발생한다.**
> 
> 반대로 인스턴스 메서드는 호출한 객체의 참조값이 `this`로 전달되기 때문에 `instanceValue`를 현재 객체의 필드로 판단할 수 있다.
> 
>정적 메서드에서도 인스턴스 필드를 사용할 수는 있지만, 다음처럼 **대상 객체를 직접 지정해야 한다.**
>
> ```java
>static void staticMethod(Data data) { System.out.println(data.instanceValue); }
>
> ```
>
>즉, 인스턴스 메서드는 `this`가 있어야 정해져 있고, 정적 메서드는 `this`가 없으므로 객체를 직접 지정해야 한다.

흔히 "`static` 메서드는 static만 사용할 수 있다." 라고 외우는데, 이 표현은 부정확하다. 정적 메서드도 **객체를 명확하게 가지고 있다면 인스턴스 멤버를 사용**할 수 있다.

| 호출하는 쪽       |       인스턴스 멤버 | `static` 멤버 |
| ------------ | ------------: | ----------: |
| 인스턴스 메서드     |             O |           O |
| `static` 메서드 | 객체 참조가 있어야 가능 |           O |

#### `main()`
```java
public class MemoryMain {

    public static void main(String[] args) {
        System.out.println("실행");
    }
}
```
JVM은 애플리케이션을 시작하기 전에 먼저 `MemoryMain`객체를 만들어 놓고 그 객체의 메서드를 호출하는 방식이 아니라, 시작 클래스(`MemoryMain`)를 로딩·초기화한 뒤 진입점인 `static main()`을 호출한다.

예를 들어 `java MemoryMain`으로 실행했다면 **`MemoryMain`이 시작 클래스**이고, Spring Boot에서는 일반적으로 `@SpringBootApplication`과 `main()`을 가진 클래스가 그 역할을 한다.

### 5. `static`을 언제 사용하고 무엇을 조심해야 하는가

`static`은 큭정 객체의 상태와 관계없이 클래스 수준에서 하나만 필요하거나, 객체를 만들 이유가 없는 기능에서 자연스럽다. 대표적인 것이 순수한 계산 기능을 모아 놓은 유틸리티 클래스다.
```java
public class MathUtils {

    private MathUtils() {
    }

    public static int max(int a, int b) {
        return a > b ? a : b;
    }

    public static int min(int a, int b) {
        return a < b ? a : b;
    }
}

// 사용할 때도 객체를 만들지 않는다.
int max = MathUtils.max(10, 20);
```


하지만 "`객체를 만들기 귀찮으니 전부 static으로 만들자`"는 방향으로 가면 문제가 생긴다. 특히 변경 가능한 정적 변수는 애플리케이션 전체에서 공유하는 상태가 된다.
```java
public class GlobalData {
    public static int count;
}

GlobalData.count = 100;
```
- 정적 변수를 변경하면 같은 JVM에서 이 값을 사용하는 모든 코드가 영향을 받는다.
- 어디에서 값이 변경됐는지 추적이 어려워지고, 여러 스레드가 동시에 변경하는 프로그램에서는 동시성 문제도 발생할 수 있다.

즉, `static`자체가 위험한 것이 아닌 **하나의 변경 가능한 상태를 여러 코드와 여러 스레드가 공유하게 되는 구조**가 문제의 핵심이다. 

