<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExpenseResource\Pages;
use App\Models\Expense;
use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\DateColumn;

class ExpenseResource extends Resource
{
    protected static ?string $model = Expense::class;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required()
                    ->label('Usuario'),

                TextInput::make('category')
                    ->required()
                    ->maxLength(255)
                    ->label('Categoría'),

                TextInput::make('amount')
                    ->numeric()
                    ->required()
                    ->label('Monto'),

                DatePicker::make('date')
                    ->required()
                    ->label('Fecha del gasto'),

                Textarea::make('description')
                    ->label('Descripción'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')->label('Usuario'),
                TextColumn::make('category')->label('Categoría')->searchable(),
                TextColumn::make('amount')->label('Monto')->money('USD'),
                DateColumn::make('date')->label('Fecha'),
                TextColumn::make('description')->label('Descripción')->limit(30),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListExpenses::route('/'),
            'create' => Pages\CreateExpense::route('/create'),
            'edit' => Pages\EditExpense::route('/{record}/edit'),
        ];
    }
}
