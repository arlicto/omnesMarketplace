<?php

declare(strict_types=1);

namespace App\Core;

use Psr\Container\ContainerInterface;
use ReflectionClass;
use ReflectionUnionType;
use ReflectionIntersectionType;
use Exception;

class Container implements ContainerInterface
{
    private array $entries = [];
    private array $resolved = [];

    /**
     * Register a factory callback for a specific identifier.
     *
     * @param string $id
     * @param callable $factory
     * @return void
     */
    public function set(string $id, callable $factory): void
    {
        $this->entries[$id] = $factory;
        unset($this->resolved[$id]);
    }

    /**
     * Find an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @throws NotFoundExceptionIfNoEntry   No entry was found for this identifier.
     * @throws ContainerExceptionIfError    Error while retrieving the entry.
     *
     * @return mixed Entry.
     */
    public function get(string $id)
    {
        if (isset($this->entries[$id])) {
            if (!array_key_exists($id, $this->resolved)) {
                $this->resolved[$id] = $this->entries[$id]($this);
            }
            return $this->resolved[$id];
        }

        // Fall back to autowiring if the class exists
        if (class_exists($id)) {
            return $this->autowire($id);
        }

        throw new class("Entry '$id' not found in the container.") extends Exception implements \Psr\Container\NotFoundExceptionInterface {};
    }

    /**
     * Returns true if the container can return an entry for the given identifier.
     * Returns false otherwise.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return bool
     */
    public function has(string $id): bool
    {
        return isset($this->entries[$id]) || class_exists($id);
    }

    /**
     * Autowire a class by analyzing its constructor parameters and resolving dependencies.
     *
     * @param string $className
     * @return object
     * @throws ContainerExceptionIfError
     */
    private function autowire(string $className): object
    {
        $reflector = new ReflectionClass($className);
        if (!$reflector->isInstantiable()) {
            throw new class("Class '$className' is not instantiable.") extends Exception implements \Psr\Container\ContainerExceptionInterface {};
        }

        $constructor = $reflector->getConstructor();
        if ($constructor === null) {
            return new $className();
        }

        $parameters = $constructor->getParameters();
        $dependencies = [];

        foreach ($parameters as $parameter) {
            $type = $parameter->getType();
            if ($type === null) {
                if ($parameter->isDefaultValueAvailable()) {
                    $dependencies[] = $parameter->getDefaultValue();
                    continue;
                }
                throw new class("Cannot resolve parameter '{$parameter->getName()}' in class '$className' because it has no type declaration and no default value.") extends Exception implements \Psr\Container\ContainerExceptionInterface {};
            }

            if ($type instanceof ReflectionUnionType || $type instanceof ReflectionIntersectionType) {
                throw new class("Union/Intersection types are not supported for autowiring in class '$className'.") extends Exception implements \Psr\Container\ContainerExceptionInterface {};
            }

            $typeName = $type->getName();
            $dependencies[] = $this->get($typeName);
        }

        return $reflector->newInstanceArgs($dependencies);
    }
}
