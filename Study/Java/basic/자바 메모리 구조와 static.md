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

> [!note]- 과정
> 메서드를 호출하면 → 그 메서드의 스택 프레임이 Stack에 생기고 → 메서드가 끝나면 프레임이 사라진다. 반면 `new Counter()`로 생성한 객체는 Heap에 존재하며, 스택의 `counter` 지역 변수는 그 객체의 참조값을 가지고 있다.


```
스택                         힙

main() 프레임
counter ──────────────────▶ Counter 객체
number = 10                 count = 0
```
여기서 `counter.increase()`를 호출하면 기존 `main()` 프레임 안에서 모든 일이 처리되는 것이 아니라 **`increase()`를 실행하기 위한 새로운 스택 프레임이 위에 추가**된다.

즉, **메서드가 호출될 때마다 새로운 프레임이 만들어지고, 메서드 실행이 끝나면 해당 프레임이 제거된다.** 프레임 안에는 지역 변수 공간과 계산을 위한 피연산자 스택 등이 존재한다.

이 과정은 `this`와도 연결된다. 인스턴스 메서드가 호출되면 JVM의 지역 변수 영역 첫 번째