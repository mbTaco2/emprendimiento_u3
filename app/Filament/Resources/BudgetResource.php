<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BudgetResource\Pages;
use App\Models\Budget;
use Filament\Forms;
use Filament\Tables;
use Filament\Forms\Form;
use Filament\Tables\Table;
use Filament\Resources\Resource;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\TextColumn;

class BudgetResource extends Resource
{
    protected static ?string $model = Budget::class;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Select::make('user_id')->relationship('user', 'name')->required()->label('Usuario'),
            TextInput::make('total')->numeric()->required()->label('Total'),
            TextInput::make('period')->required()->label('Periodo'),
            Textarea::make('categories')->label('Categorías (JSON)'),
            Textarea::make('recommendations')->label('Recomendaciones'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('user.name')->label('Usuario'),
            TextColumn::make('total')->label('Total')->money('USD'),
            TextColumn::make('period')->label('Periodo'),
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
            'index' => Pages\ListBudgets::route('/'),
            'create' => Pages\CreateBudget::route('/create'),
            'edit' => Pages\EditBudget::route('/{record}/edit'),
        ];
    }
}
