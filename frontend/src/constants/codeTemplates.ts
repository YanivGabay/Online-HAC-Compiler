export const codeTemplates = {
  'gcc': `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,

  'g++': `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
}; 